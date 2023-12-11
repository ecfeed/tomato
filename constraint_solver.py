from constraint_parser import ConstraintLogicParser
from pysat.card import CardEnc
from pysat.solvers import Solver
import model
from constraint import *

class TomatoSolver:
    def __init__(self, function):        
        self.function = function
        self.parser = ConstraintLogicParser()
        self.parameters = self.function.get_parameter_names()
        self.choices = self.function.get_leaf_choices()
        
        # print(f'Parameters: {self.parameters}')
        # print(f'Choices: {self.choices}')
        
        self.choice_mapping = self.__prepare_choice_mapping()
        self.top_id = max([val for mapping in self.choice_mapping.values() for key, val in mapping.items()])
        self.model_semantics = []
        self.__prepare_model_semantics()
        # print(f'Unconstrained model semantics:\n {self.model_semantics.clauses}')

        # print(f'Parsing constraints')
        for name, formulas_list in self.function.constraints.items():
            for formula in formulas_list:
                # print(f'Parsing formula: {formula}')
                constraint = self.parser.parse_constraint(formula)
                self.top_id, cnf = constraint.to_cnf(self.choice_mapping, self.top_id)
                self.model_semantics.extend(cnf.clauses)
              
        self.solver = Solver(bootstrap_with=self.model_semantics)
        # print(f'Constrained model semantics:\n {self.model_semantics.clauses}')
        
        self.assignments = {}
        # print(f'Parsing assignments')
        output_parameter_names = [p.name for p in self.function.output_parameters]
        for name, formulas_list in self.function.assignments.items():
            # print(f'parsing {name}: {formulas_list}')
            if name not in self.assignments:
                self.assignments[name] = []
            for formula in formulas_list:
                # print(f'Parsing formula: {formula}')
                assignment_tokens = self.parser.parse_assignment(formula)
                
                assignment = Assignment(self.function, assignment_tokens[0], assignment_tokens[1])
                # print(f'Assignment: {assignment}')
                self.assignments[name].append(assignment)
                
    def test(self, test_case):
        # print(f'Testing: {test_case}')
        clause = self.__tuple_to_clause(test_case)
        # print(f'Clause: {clause}')
        result = self.solver.solve(assumptions=clause)
        # if result == False:
            # print(f'Failed clause: {clause}. Failing example: {self.solver.get_core()}')
            # exit(1)
        # print(f'result: {self.solver.solve(assumptions=clause)}')
        # return self.solver.solve(assumptions=clause)
        return result
    
    def choice_selected(self, parameter_index, choice):
        parameter_name = self.parameters[parameter_index]
        # print(f'Choice selected: {parameter_name} (index {parameter_index}): {choice}')
        mapping = self.choice_mapping[parameter_name]
        # print(f'Mapping for parameter {parameter_name}: {mapping}')
        choice_representation = mapping[choice]
        clause = [choice_representation]
        # print(f'Adding clause: {clause}')
        self.solver.add_clause(clause)
        
    def tuple_selected(self, test_tuple):
        # print(f'Tuple selected: {test_tuple}')
        for i, choice in enumerate(test_tuple):
            if choice != None:
                mapping = self.choice_mapping[self.parameters[i]]
                choice_representation = mapping[choice]
                self.solver.add_clause([choice_representation])
                # print(f'Adding clause: {choice_representation}')

    def new_test_case(self):
        self.solver.delete()
        self.solver = Solver(bootstrap_with=self.model_semantics)

    def adapt(self, test_case):
        clause = self.__tuple_to_clause(test_case)
        for assignment_group in self.assignments.values():
            for assignment in assignment_group:
                top_id, precondition_cnf = assignment.precondition.to_cnf(self.choice_mapping, self.top_id)
                # print(f'Precondition: {precondition_cnf.clauses}')
                # solver = Solver(bootstrap_with=precondition_cnf.clauses)
                solver = Solver(bootstrap_with=self.model_semantics)
                solver.append_formula(precondition_cnf.clauses)
                solver.add_clause([top_id])
                if solver.solve(assumptions=clause):
                    # print(f'Adapting assignment: {assignment}')
                    # print(f'model: {solver.get_model()}')
                    assignment.apply(test_case)
                    # print(f'Adapted test case: {test_case}')
        return test_case

    def __tuple_to_clause(self, tested_tuple):
        clause = []
        for n, choice in enumerate(tested_tuple):
            if choice == None:
                continue
            parameter_name = self.parameters[n]
            choice_representation = self.choice_mapping[parameter_name][choice]
            clause.append(choice_representation)
            
        # print(f'Clause for tuple {tested_tuple}: {clause}')
        return clause

    # map each choice to a number. This number means that a given choice is
    # selected in a test suite.
    def __prepare_choice_mapping(self):
        choice_mapping = {}
        i = 1
        for n, parameter in enumerate(self.parameters):
            mapping = {}
            choice_mapping[parameter] = mapping
            for choice in self.choices[n]:
                mapping[choice] = i
                i += 1
        
        # print(f'Choice mapping:\n{choice_mapping}')
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
        
        # print(f'top id: {self.top_id}')
        for parameter in self.parameters:
            choices = self.__get_parameter_choices_representation(parameter)
            # clause = [choice for choice in choices]
            # self.model_semantics.append(clause)
            semantics = CardEnc.equals(lits=choices, bound=1, top_id=self.top_id)
            self.model_semantics.extend(semantics.clauses)
            self.top_id = semantics.nv

# m = model.Model('examples/function.yaml')
# solver = TomatoSolver(m.functions['basket checkout'])
    
# class TomatoAssigner:
#     def __init__(self, function):
#         self.function = function
#         self.parser = ConstraintLogicParser()
#         self.assignments = []
#         output_parameters = [p.name for p in function.output_parameters]
#         print(f'Ouput parameters: {output_parameters}')
        
#         # print(f'Parsing constraints')
#         for name, formulas_list in self.function.assignments.items():
#             for formula in formulas_list:
#                 print(f'Parsing assignment: {formula}')
#                 tokens = self.parser.parse_assignment(formula)
#                 print(f'Parsed tokens: {tokens}')
#                 self.assignments.append(Assignment(output_parameters, tokens[0], tokens[1]))
