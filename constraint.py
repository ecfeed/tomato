from pysat.formula import CNF
from pysat.process import Processor

def parse_expression(expression_tokens):
    while len(expression_tokens) == 1:
        expression_tokens = expression_tokens[0]
        
    if expression_tokens[0] == 'NOT':
        return NegatedExpression(tokens=expression_tokens[1:])
        
    elif any(element in expression_tokens.asList() for element in ['AND', 'OR']) and len(expression_tokens):
        # conjunction or disjunction
        rval_tokens = expression_tokens.pop()
        operator = expression_tokens.pop()
        lval_tokens = expression_tokens
        
        return CompositeExpression(operator, tokens=[lval_tokens, rval_tokens])
            
    elif any(element in expression_tokens.asList() for element in ['IS', 'IS NOT', 'IN', 'NOT IN']) and len(expression_tokens) == 3:
        # primitive statement
        rval_tokens = expression_tokens.pop()
        operator = expression_tokens.pop()
        lval_tokens = expression_tokens
        
        return PrimitiveStatement(lval_tokens, operator, rval_tokens)

class CompositeExpression:
    def __init__(self, operator, 
                 tokens=None, 
                 expr=None):
        
        self.operator = operator
        if tokens is not None:
            self.lval = parse_expression(tokens[0])
            self.rval = parse_expression(tokens[1])
        elif expr is not None:
            self.lval = expr[0]
            self.rval = expr[1]
        
    def __str__(self):
        return '(' + str(self.lval) + ' ' + self.operator + ' ' + str(self.rval) + ')'
    
    def to_cnf(self, choice_mapping, top_id):
        #y = A AND B compiles to [A, !y] AND [B, !y] AND [!A, !B, y]
        
        lval_id, lval = self.lval.to_cnf(choice_mapping, top_id)
        rval_id, rval = self.rval.to_cnf(choice_mapping, lval_id)
        clauses = lval.clauses + rval.clauses
        my_id = rval_id + 1
        
        # print(f'lval_clauses: {lval.clauses}')
        # print(f'rval_clauses: {rval.clauses}')
        
        if self.operator == 'AND':
            clauses.extend([[lval_id, -my_id], [rval_id, -my_id], [-lval_id, -rval_id, my_id]])
            
        elif self.operator == 'OR':
            clauses.extend([[-lval_id, my_id], [-rval_id, my_id], [lval_id, rval_id, -my_id]])            

        else:
            raise Exception(f'Parsing expression {str(self)}: unknown operator {self.operator}')

        cnf = CNF(from_clauses=clauses)
        return my_id, cnf

        
class NegatedExpression:
    def __init__(self, 
                 tokens = None, 
                 expr = None):
        
        if tokens is not None:
            self.expression = parse_expression(tokens)
        elif expr is not None:
            self.expression = expr        
    
    def __str__(self):
        return '(NOT ' + str(self.expression) + ')'
    
    def to_cnf(self, choice_mapping, top_id):
        expr_id, expr = self.expression.to_cnf(choice_mapping, top_id)
        my_id = expr_id + 1
        #negate expr
        expr.extend([[my_id, expr_id], [-my_id, -expr_id]])
        
        return my_id, expr

class PrimitiveStatement:
    def __init__(self, lval, operator, rval):
        self.negated = False
        if 'NOT' in operator:
            self.negated = True
        
        self.lval = lval[0]
        
        if 'IS' in operator:
            self.values = [rval]
        elif 'IN' in operator:
            self.values = rval.asList()
            
    def __str__(self):
        return '(' + str(self.lval) + (' NOT IN ' if self.negated else ' IN ') + str(self.values) + ')'
    
    def to_cnf(self, choice_mapping, top_id):
        parameter_name = self.lval
        parameter_mapping = choice_mapping[parameter_name]
        allowed_choices = []
        
        def filter_choices(choices, values):
            result = []
            for choice in choices:
                for value in values:
                    if choice == value or choice.startswith(value + '::'):
                        result.append(choice)
            return result
        
        selected_choices = filter_choices(parameter_mapping.keys(), self.values)
        
        if self.negated:
            selected_choices = [choice for choice in parameter_mapping.keys() if choice not in selected_choices]
        
        allowed = [parameter_mapping[choice] for choice in selected_choices]
        clauses = []

        my_id = top_id + 1  
        # if len(allowed) == 1:
        #     clause = allowed
        #     clause.append(-my_id)
        #     clauses = [clause]
            
        # elif len(allowed) > 1:
        last_clause = []
        for x in allowed:
            clauses.append([-x, my_id])
            last_clause.append(x)
        last_clause.append(-my_id)
        clauses.append(last_clause)
        
        return my_id, CNF(from_clauses=clauses)

class Invariant:
    def __init__(self, expression_tokens):
        self.expression = parse_expression(expression_tokens)

    def __str__(self):
        return str(self.expression)        

    #returns top_id and CNF
    def to_cnf(self, choice_mapping, top_id):
        invariant_id, result = self.expression.to_cnf(choice_mapping, top_id)
        result.append([invariant_id])

        return invariant_id, result
    
class Implication:
    def __init__(self, precondition_tokens, postcondition_tokens):
        self.precondition = parse_expression(precondition_tokens)
        self.postcondition = parse_expression(postcondition_tokens)
        
    def __str__(self):
        return 'IF ' + str(self.precondition) + ' THEN ' + str(self.postcondition)
    
    #returns top_id and CNF
    def to_cnf(self, choice_mapping, top_id):
        precondition_id, precondition_cnf = self.precondition.to_cnf(choice_mapping, top_id)
        postcondition_id, postcondition_cnf = self.postcondition.to_cnf(choice_mapping, precondition_id)

        return postcondition_id, CNF(from_clauses=[[-precondition_id, postcondition_id]] + precondition_cnf.clauses + postcondition_cnf.clauses)
        
class Assignment:
    def __init__(self, function, precondition_tokens, assignments_tokens):
        # print(f'Create assignment: {precondition_tokens} implies {assignments_tokens}')
        # print(f'Output parameters: {output_parameters}')
        self.function = function
        self.precondition = parse_expression(precondition_tokens)
        self.assignments = {}
        output_parameters = [p.name for p in function.output_parameters]
        for assignment in assignments_tokens:
            name = assignment[0]
            value = assignment[1]
            if name not in output_parameters:
                raise Exception(f'Unknown output parameter: {name}')
            self.assignments[name] = value
    
    def __str__(self):
        return 'IF ' + str(self.precondition) + ' THEN ' + str(self.assignments)  
    
    def apply(self, test_case):
        for name, value in self.assignments.items():
            test_case[self.function.get_parameter_index(name)] = value
            