from copy import deepcopy
import sys
import yaml
import fileinput

class ParameterParent:
    def get_parameter(name):
        pass
    
class ChoiceParent:
    def get_choice_names():
        pass

class Choice:
    def __init__(self, description):
        self.name = ''
        self.value = ''
        self.choices = []
        
        if isinstance(description, dict):
            children = list(description.keys())
            self.name = children[0]
            
            if description[self.name] is not None:
                self.value = str(description[self.name])
            else:
                self.value = self.name
                
            if 'choices' in description:
                self.choices = [Choice(choice) for choice in description['choices']]
        else:
            self.name = str(description)
            self.value = str(description)
                    
    def __str__(self):
        return f'{self.name}: {self.value}'
    
    def __repr__(self):
        return str(self)
    
    def get_choice_names(self, current_path=''):
        if current_path == '':
            current_path = self.name
        else:
            current_path = f'{current_path}::{self.name}'
        if self.choices:
            result = []
            for choice in self.choices:
                if len(choice.choices) == 0:
                    result.append(f'{current_path}::{choice.name}')
                else:
                    result.extend(choice.get_choice_names(current_path))
            return result
        else:
            return []
        
    def get_choice(self, name):
        if '::' in name:
            tokens = name.split('::')
            child_name = tokens[0]
            remains = '::'.join(tokens[1:])
            
            for choice in self.choices:
                if choice.name == child_name:
                    return choice.get_choice(remains)
        else:
            for choice in self.choices:
                if choice.name == name:
                    return choice
        return None


class OutputParameter:
    def __init__(self, description):
        self.name = description['output parameter']
        self.default_value = description['default value']
        self.parameters = []
        
    def __str__(self):
        return f'{self.name}: {self.default_value}'
    
    def __repr__(self):
        return str(self)
    
    def get_choice_names(self):
        return [str(self.default_value)]
        
class Parameter:
    def __init__(self, description, global_params) -> None:
        self.name = ''
        self.choices = []
        self.parameters = []
        
        if isinstance(description, dict):
            self.name = description['parameter']
            if 'parameters' in description and 'choices' in description:
                print(f'Error: {self.name} has both parameters and choices')
                sys.exit(1)
            if 'parameters' in description:
                for parameter in description['parameters']:
                    if 'linked parameter' in parameter:
                        linked_to = parameter['linked to']
                        name = parameter['linked parameter']
                        copy = deepcopy(global_params[linked_to])
                        copy.name = name
                        self.parameters.append(copy)
                    else:
                        self.parameters.append(Parameter(parameter, global_params))
            if 'choices' in description:
                self.choices = [Choice(choice) for choice in description['choices']]
                
    def __str__(self):
        result = f'{self.name}'
        if self.parameters:
            result += '('
            for parameter in self.parameters:
                result += f'{parameter}, '
            result = result[:-2] + ')'
        return result
    
    def __repr__(self):
        return str(self)

    def get_parameter_names(self, current_path=''):
        result = []
        if current_path == '':
            current_path = self.name
        else:
            current_path = f'{current_path}::{self.name}'
        for parameter in self.parameters:
            if parameter.parameters:
                result.extend(parameter.get_parameter_names(current_path))
            else:
                result.append(f'{current_path}::{parameter.name}')
        return result
    
    def get_choice_names(self, current_path=''):
        if self.parameters:
            return [parameter.get_choice_names() for parameter in self.parameters]
        elif self.choices:
            result = []
            for choice in self.choices:
                if len(choice.choices) == 0:
                    result.append(choice.name)
                else:
                    result.extend(choice.get_choice_names())
            return result
        else:
            return []

    def get_parameter(self, name):
        if '::' in name:
            tokens = name.split('::')
            child_name = tokens[0]
            remains = '::'.join(tokens[1:])
            
            for parameter in self.parameters:
                if parameter.name == child_name:
                    return parameter.get_parameter(remains)
        else:
            for parameter in self.parameters:
                if parameter.name == name:
                    return parameter
        return None
        
    def get_choice(self, name):
        if '::' in name:
            tokens = name.split('::')
            child_name = tokens[0]
            remains = '::'.join(tokens[1:])
            
            for choice in self.choices:
                if choice.name == child_name:
                    return choice.get_choice(remains)
        else:
            for choice in self.choices:
                if choice.name == name:
                    return choice
        return None

class Function:
    def __init__(self, global_params, description):
        self.name = description['function']
        self.parameters = []
        self.output_parameters = []
        for parameter in description['parameters']:
            if 'output parameter' in parameter:
                param = OutputParameter(parameter)
                self.parameters.append(param)
                self.output_parameters.append(param)
            elif 'linked parameter' in parameter:
                linked_to = parameter['linked to']
                name = parameter['linked parameter']
                copy = deepcopy(global_params[linked_to])
                copy.name = name
                self.parameters.append(copy)
            else:
                self.parameters.append(Parameter(parameter, global_params))
                        
        self.aliases = {}
        self.constraints = {}
        self.assignments = {}
        if 'logic' in description:
            logic = description['logic']
            
            if 'aliases' in logic:
                for alias in logic['aliases']:
                    name = list(alias.keys())[0]
                    value = alias[name]

                    if name in self.aliases:
                        raise Exception(f"Alias '{name}' already defined")
                    self.aliases[name] = value
    
            if 'constraints' in logic:
                for constraint in logic['constraints']:
                    name = list(constraint.keys())[0]
                    value = constraint[name]

                    if name not in self.constraints:
                        self.constraints[name] = []
                    self.constraints[name].append(value)
                
            if 'assignments' in logic:
                for assignment in logic['assignments']:
                    name = list(assignment.keys())[0]
                    value = assignment[name]

                    if name not in self.assignments:
                        self.assignments[name] = []
                    self.assignments[name].append(value)
        
    def __str__(self):
        return f'{self.name}({[parameter.name for parameter in self.parameters]})'
    
    def get_parameter(self, name):
        if '::' in name:
            tokens = name.split('::')
            child_name = tokens[0]
            remains = '::'.join(tokens[1:])
            
            for parameter in self.parameters:
                if parameter.name == child_name:
                    return parameter.get_parameter(remains)
        else:
            for parameter in self.parameters:
                if parameter.name == name:
                    return parameter
        return None
    
    def get_parameter_index(self, name):
        for i, parameter in enumerate(self.get_parameter_names()):
            if parameter == name:
                return i
        return None
    
    def get_parameter_names(self):
        result = []
        for parameter in self.parameters:
            if parameter.parameters:
                result.extend(parameter.get_parameter_names())
            else:
                result.append(parameter.name)
        return result
    
    def get_leaf_choices(self):
        result = [parameter.get_choice_names() for parameter in self.parameters]
        def flatten_array(array):
            result = []
            for item in array:
                if isinstance(item, list):
                    l = [sub_item for sub_item in item if not isinstance(sub_item, list)]
                    result.append(l)
                    result.extend(flatten_array([sub_item for sub_item in item if isinstance(sub_item, list)]))
                else:
                    result.append(item)
            result = [item for item in result if item != []]
            return result
        return flatten_array(result)
    
    def get_generator_input(self):
        return self.get_parameter_names(), self.get_leaf_choices()

    def replace_choice_names_with_values(self, test_case):
        parameter_names = self.get_parameter_names()
        for i, name in enumerate(parameter_names):
            if name in [p.name for p in self.output_parameters]:
                continue
            parameter = self.get_parameter(name)
            choice_name = test_case[i]
            choice = parameter.get_choice(choice_name)
            choice_value = choice.value
            test_case[i] = choice_value
        return test_case

class Model:
    def __init__(self, file):
        try:
            if file is not None:
                with open(file, 'r') as f:
                    model = yaml.safe_load(f.read())
            else:
                model = yaml.safe_load(''.join(fileinput.input(files=[])))
                
            global_params = {}
            if 'global parameters' in model:
                for parameter in model['global parameters']:
                    global_params[parameter['parameter']] = Parameter(parameter, global_params)
                    
            if 'functions' in model:
                self.functions = {f.name : f for f in [Function(global_params, function) for function in model['functions']]}
            elif 'function' in model:
                self.functions = {function.name : function for function in [Function(global_params, model['function'])]}
            else:
                print('Error: no function specified')
                sys.exit(1)
        except OSError as e:
            print(f'Error: unable to open file {file}: {e}')
            sys.exit(1)
