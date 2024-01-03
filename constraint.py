from pysat.formula import CNF
from pyparsing import *

def parse_expression(expression_tokens, aliases):
    if len(expression_tokens) == 1 and isinstance(expression_tokens[0], str):
        if expression_tokens[0] in aliases:
            return aliases[expression_tokens[0]].statement
        else:
            raise Exception(f"'{expression_tokens}' is not a defined alias")

    while len(expression_tokens) == 1:
        expression_tokens = expression_tokens[0]

    if expression_tokens[0] == 'NOT':
        return NegatedExpression(tokens=expression_tokens[1:], aliases=aliases)
        
    elif any(element in expression_tokens.asList() for element in ['AND', 'OR']) and len(expression_tokens):
        # conjunction or disjunction
        rval_tokens = expression_tokens.pop()
        operator = expression_tokens.pop()
        lval_tokens = expression_tokens
        
        return CompositeExpression(operator, tokens=[lval_tokens, rval_tokens], aliases=aliases)
            
    elif any(element in expression_tokens.asList() for element in ['IS', 'IS NOT', 'IN', 'NOT IN']) and len(expression_tokens) == 3:
        # primitive statement
        rval_tokens = expression_tokens.pop()
        operator = expression_tokens.pop()
        lval_tokens = expression_tokens
        
        return PrimitiveStatement(lval_tokens, operator, rval_tokens)

class CompositeExpression:
    def __init__(self, operator, 
                 aliases,
                 tokens=None, 
                 expr=None):
        
        self.operator = operator
        if tokens is not None:
            self.lval = parse_expression(tokens[0], aliases)
            self.rval = parse_expression(tokens[1], aliases)
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
                 expr = None,
                 aliases = None):
        
        if tokens is not None:
            self.expression = parse_expression(tokens, aliases)
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
        last_clause = []
        for x in allowed:
            clauses.append([-x, my_id])
            last_clause.append(x)
        last_clause.append(-my_id)
        clauses.append(last_clause)
        
        return my_id, CNF(from_clauses=clauses)

class Invariant:
    def __init__(self, expression_tokens, aliases):
        self.expression = parse_expression(expression_tokens, aliases)

    def __str__(self):
        return str(self.expression)        

    #returns top_id and CNF
    def to_cnf(self, choice_mapping, top_id):
        invariant_id, result = self.expression.to_cnf(choice_mapping, top_id)
        result.append([invariant_id])

        return invariant_id, result
    
class Implication:
    def __init__(self, precondition_tokens, postcondition_tokens, aliases):
        self.precondition = parse_expression(precondition_tokens, aliases)
        self.postcondition = parse_expression(postcondition_tokens, aliases)
        
    def __str__(self):
        return 'IF ' + str(self.precondition) + ' THEN ' + str(self.postcondition)
    
    #returns top_id and CNF
    def to_cnf(self, choice_mapping, top_id):
        precondition_id, precondition_cnf = self.precondition.to_cnf(choice_mapping, top_id)
        postcondition_id, postcondition_cnf = self.postcondition.to_cnf(choice_mapping, precondition_id)

        return postcondition_id, CNF(from_clauses=[[-precondition_id, postcondition_id]] + precondition_cnf.clauses + postcondition_cnf.clauses)
        
class Assignment:
    def __init__(self, function, precondition_tokens, assignments_tokens, aliases):
        self.function = function
        self.precondition = parse_expression(precondition_tokens, aliases)
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

class StatementAlias:
    def __init__(self, statement_tokens, aliases):
        self.statement = parse_expression(statement_tokens, aliases)
    
    def __str__(self):
        return "Alias: " + str(self.statement)

class Parser:
    def __init__(self):
        self.is_literal = CaselessLiteral("IS")
        self.not_literal = CaselessLiteral("NOT")
        self.in_literal = CaselessLiteral("IN")

        self.is_relation = self.is_literal
        self.is_not_relation = Combine(self.is_literal + self.not_literal, adjacent=False, joinString=' ')
        self.in_relation = self.in_literal
        self.not_in_relation = Combine(self.not_literal + self.in_literal, adjacent=False, joinString=' ')

        self.name = QuotedString('\'', escChar='\\') | QuotedString('"', escChar='\\') 
        # self.name = QuotedString('\'', escChar='\\') | QuotedString('"', escChar='\\') | Word(printables, excludeChars=',')
        # self.name = QuotedString('\'', escChar='\\') | QuotedString('"', escChar='\\') | Word(pyparsing_unicode.printables, excludeChars=',')
        self.aggregated_name = Group(Suppress('[') + self.name + OneOrMore(Suppress(',') + self.name) + Suppress(']'))

        self.simple_statement = self.name + self.is_relation + self.name | self.name + self.is_not_relation + self.name
        self.aggregate_statement = self.name + self.in_relation + self.aggregated_name | self.name + self.not_in_relation + self.aggregated_name
        self.primitive_statement = Group(self.simple_statement | self.aggregate_statement)
        self.alias = self.name

        self.and_literal = CaselessLiteral("AND")
        self.or_literal = CaselessLiteral("OR")
        self.logical_operator = self.and_literal | self.or_literal
        self.logical_operator.setResultsName('logical_operator')
        self.expression = Group(infixNotation(self.primitive_statement | self.alias, 
            [
                (self.not_literal, 1, opAssoc.RIGHT), 
                (self.logical_operator, 2, opAssoc.LEFT), 
                (self.or_literal, 2, opAssoc.LEFT)
            ]))

        self.if_literal = CaselessLiteral("IF")
        self.then_literal = CaselessLiteral("THEN")
        self.implies_literal = CaselessLiteral("=>")

    def parse_statement_alias(self, statement_alias_string, aliases):
        try:
            tokens = self.expression.parseString(statement_alias_string, parseAll=True)
        except ParseException as e:
            raise Exception(f'Parsing statement alias {statement_alias_string}: {e.msg}, {e.explain(e)}')
        return StatementAlias(tokens, aliases)
            
    def parse_constraint(self, constraint_string, aliases):
        implication = self.expression + Suppress(self.implies_literal) + self.expression | Suppress(self.if_literal) + self.expression + Suppress(self.then_literal) + self.expression
        invariant = self.expression
        constraint = implication | invariant
        try:
            tokens = constraint.parseString(constraint_string, parseAll=True)
        except ParseException as e:
            raise Exception(f'Parsing constraint {constraint_string}: {e.msg}, {e.explain(e)}')
        if len(tokens) == 1:
            # invariant
            return Invariant(tokens[0], aliases)
        if len(tokens) == 2:
            # implication
            return Implication(tokens[0], tokens[1], aliases)

    def parse_assignment(self, assignment_string, function, aliases):
        equals_literal = CaselessLiteral("=")
        assignment_value = QuotedString('\'', escChar='\\') | Word(printables, excludeChars=',=')
        # assignment_value = QuotedString('\'', escChar='\\') | Word(pyparsing_unicode.printables, excludeChars=',=')
        assignent_statement = Group(self.name + Suppress(equals_literal) + assignment_value)
        assignents_list = Group(assignent_statement + ZeroOrMore(Suppress(',') + assignent_statement))
        
        # assignment = self.expression + Suppress(self.implies_literal) + assignents_list
        assignment = self.expression + Suppress(self.implies_literal) + assignents_list | Suppress(self.if_literal) + self.expression + Suppress(self.then_literal) + assignents_list
        try:
            tokens = assignment.parseString(assignment_string, parseAll=True)
        except ParseException as e:
            raise Exception(f'Parsing assignment {assignment_string}: {e.msg}, {e.explain(e)}')
        return Assignment(function, tokens[0], tokens[1], aliases)

