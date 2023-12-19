from pysat.card import CardEnc
from pysat.formula import CNF
from pysat.solvers import Solver
from constraint import Parser, Assignment

class TomatoSolver:
    def __init__(self, function):        
        self.function = function
        self.parser = Parser()
        self.parameters = self.function.get_parameter_names()
        self.choices = self.function.get_leaf_choices()
        
        self.choice_mapping = self.__prepare_choice_mapping()
        self.top_id = max([val for mapping in self.choice_mapping.values() for key, val in mapping.items()])
        self.model_semantics = []
        self.__prepare_model_semantics()

        aliases = {}
        for name, formula in self.function.aliases.items():
            aliases[name] = self.parser.parse_statement_alias(formula, aliases)

        for name, formulas_list in self.function.constraints.items():
            for formula in formulas_list:
                constraint = self.parser.parse_constraint(formula, aliases)
                self.top_id, cnf = constraint.to_cnf(self.choice_mapping, self.top_id)
                self.model_semantics.extend(cnf.clauses)
              
        self.solver = Solver(bootstrap_with=self.model_semantics)
        
        self.assignments = {}
        for name, formulas_list in self.function.assignments.items():
            if name not in self.assignments:
                self.assignments[name] = []
            for formula in formulas_list:
                assignment = self.parser.parse_assignment(formula, self.function, aliases)
                # assignment_tokens = self.parser.parse_assignment(formula)
                
                # assignment = Assignment(self.function, assignment_tokens[0], assignment_tokens[1])
                self.assignments[name].append(assignment)

    def restrict_test_case(self, restricted):
        #we want to add to model semantics a clause that restricts a given tuple
        # this will be : NOT (x1 AND x2 AND ... AND xn)
        # that is: NOT x1 OR NOT x2 OR ... OR NOT xn
        clause = []
        for i, choice in enumerate(restricted):
            if choice != None:
                parameter_name = self.parameters[i]
                is_output = parameter_name in [p.name for p in self.function.output_parameters]
                mapping = self.choice_mapping[self.parameters[i]]
                if not is_output:
                    clause.append(-mapping[choice])
        self.model_semantics.append(clause)
                
    def test(self, test_case):
        return self.solver.solve(assumptions=self.__tuple_to_clause(test_case))
    
    def choice_selected(self, parameter_index, choice):
        parameter_name = self.parameters[parameter_index]
        mapping = self.choice_mapping[parameter_name]
        self.solver.add_clause([mapping[choice]])
        
    def tuple_selected(self, test_tuple):
        for i, choice in enumerate(test_tuple):
            if choice != None:
                mapping = self.choice_mapping[self.parameters[i]]
                self.solver.add_clause([mapping[choice]])

    def new_test_case(self):
        self.solver.delete()
        self.solver = Solver(bootstrap_with=self.model_semantics)

    def adapt(self, test_case):
        clause = self.__tuple_to_clause(test_case)
        for assignment_group in self.assignments.values():
            for assignment in assignment_group:
                top_id, precondition_cnf = assignment.precondition.to_cnf(self.choice_mapping, self.top_id)
                solver = Solver(bootstrap_with=self.model_semantics)
                solver.append_formula(precondition_cnf.clauses)
                solver.add_clause([top_id])
                if solver.solve(assumptions=clause):
                    assignment.apply(test_case)
        return test_case

    def __tuple_to_clause(self, tested_tuple):
        clause = []
        for n, choice in enumerate(tested_tuple):
            if choice == None:
                continue
            parameter_name = self.parameters[n]
            choice_representation = self.choice_mapping[parameter_name][choice]
            clause.append(choice_representation)            
        return clause

    # map each choice to a number. This number means that a given choice is
    # selected in a test case.
    def __prepare_choice_mapping(self):
        choice_mapping = {}
        i = 1
        for n, parameter in enumerate(self.parameters):
            mapping = {}
            choice_mapping[parameter] = mapping
            for choice in self.choices[n]:
                mapping[choice] = i
                i += 1        
        return choice_mapping
    
    # returns representation of all choices for a given parameter
    def __get_parameter_choices_representation(self, parameter):
        choices = self.choice_mapping[parameter]
        result = [value for key, value in choices.items()]
        # print(f'Parameter {parameter} choices: {result}')
        return result
    
    # model semantics is a set of clauses that define a behavoir where 
    # only one choice is selected for each parameter
    def __prepare_model_semantics(self):
        
        self.model_semantics = CNF()
        
        for parameter in self.parameters:
            choices = self.__get_parameter_choices_representation(parameter)
            semantics = CardEnc.equals(lits=choices, bound=1, top_id=self.top_id)
            self.model_semantics.extend(semantics.clauses)
            self.top_id = semantics.nv

