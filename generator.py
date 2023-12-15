from itertools import combinations, product
from math import ceil
from solver import TomatoSolver
import random as rand
from copy import copy, deepcopy
import sys

def print_csv_line(header, line, output=sys.stderr):
    cleaned_line = [str(element) if element is not None else ' ' for element in line]
    if header is not None:
        output.write('(' + header + ') ')
    output.write(','.join(cleaned_line) + '\n')
    output.flush()
    # pass
    
def clean_line(output=sys.stderr):
    output.write('\033[1A')
    output.write('\033[K')
    output.flush()
    # output.write('\n')
    # pass


def random(function, length=0, duplicates=False, restricted_tests=[]):
    params, input_list = function.get_generator_input()

    solver = assigner = TomatoSolver(function)
    [solver.restrict_test_case(test_case) for test_case in restricted_tests]

    def restrict_test_case(self, test_case):
        solver.restrict_test_case(test_case)
    
    generated_tests = 0
    stop = False
    
    while ((generated_tests < length) or (length == 0)):
        indices = list(range(len(input_list)))
        rand.shuffle(indices)
        for i in indices:
            rand.shuffle(input_list[i])

        solver.new_test_case()
        test_case = [None] * len(input_list)
        # print_csv_line("",test_case)
        for i in indices:
            candidate = list(copy(test_case))
            for choice in input_list[i]:
                candidate[i] = choice
                # clean_line()
                # print_csv_line("", candidate)
                if solver.test(candidate):
                    solver.choice_selected(i, choice)
                    test_case = candidate
                    break
        if duplicates == False:
            solver.restrict_test_case(test_case)
            
        if any([choice is None for choice in test_case]):
            # clean_line()
            break
        
        assigner.adapt(test_case)
        generated_tests += 1
        # clean_line()
        yield test_case            

def adaptive_random(function, length=0, duplicates=False):
    assigner = TomatoSolver(function)
    params, input_list = function.get_generator_input()

    history = []
    sample_length = 100
    max_history_size = 100
    generated_tests = 0
    stop = False

    def distance(candidate, test_case):
        return sum([1 if candidate[i] != test_case[i] else 0 for i in range(len(candidate))])
    
    def avg_distance(candidate, history):
        if len(history) == 0:
            return 0
        else:
            return sum([distance(candidate, h) for h in history]) / len(history)
            
    
    while generated_tests < length or (length == 0):
        restricted_tests = history if not duplicates else []
        
        gen = random(function, length=sample_length, duplicates=False, restricted_tests=restricted_tests)
        candidate_set = [candidate for candidate in gen]
        # print(f'Candidate set {candidate_set}')
        # print(f'History {history}')
        best_score = -1
        best_candidate = None
        if len(candidate_set) == 0:
            break
        for candidate in candidate_set:
            candidate_score = avg_distance(candidate, history)
            # print(f'Score for {candidate} is {candidate_score}')
            if candidate_score > best_score:
                best_score = candidate_score
                best_candidate = candidate
            elif candidate_score == best_score and candidate_score != 0:
                #if the same score, select the candidate that has less appearances in history
                if history.count(candidate) < history.count(best_candidate):
                    best_candidate = candidate
                elif history.count(candidate) == history.count(best_candidate) and history.count(candidate) != 0:
                    #if the same number of appearances, select the candidate 
                    #whose last appearance was further away
                    candidate_last_index = len(history) - history[::-1].index(candidate) - 1
                    best_candidate_last_index = len(history) - history[::-1].index(best_candidate) - 1
                    if candidate_last_index < best_candidate_last_index:
                        best_candidate = candidate
        if duplicates or best_candidate not in history:
            history.append(best_candidate)
            while len(history) > max_history_size:
                history = history[1:]
            assigner.adapt(best_candidate)
            generated_tests += 1
            yield best_candidate
        else:
            break

def cartesian(function):
    solver = assigner = TomatoSolver(function)
    params, input_list = function.get_generator_input()

    combinations = product(*input_list)
    for combination in combinations:
        if solver.test(combination):
            test_case = assigner.adapt(list(combination))            
            yield test_case

def nwise(function, n, coverage=100):
    solver = assigner = TomatoSolver(function)
    params, input_list = function.get_generator_input()

    if n >= len(input_list):
        raise ValueError("n must be lower than the length of the input list")

    def tuples_covered(test_case, n):
        if n > len(test_case):
            raise ValueError("n cannot be greater than the size of the test case")

        indices = [i for i, _ in enumerate(test_case) if test_case[i] is not None]
        
        combinations_ = combinations(indices, n)
        def uncompress(indices):
            return tuple([test_case[i] if i in indices else None for i in range(len(test_case))])
        yield from [uncompress(test) for test in combinations_]
        
    def tuples(input_list, n):
        def tuple_template(n, input_size):
            if n > input_size:
                raise ValueError("n cannot be greater than m")

            for combination in combinations(range(input_size), n):
                template = [False] * input_size
                for index in combination:
                    template[index] = True
                yield template

        def tuples_from_template(input_list, template):
            len_input_list = len(input_list)
            if len_input_list != len(template):
                raise ValueError("Input list and template must have the same length")

            selected_indices = [i for i, is_selected in enumerate(template) if is_selected]

            for combination in product(*[input_list[i] for i in selected_indices]):
                result = [None] * len_input_list
                for i, index in enumerate(selected_indices):
                    result[index] = combination[i]
                yield tuple(result) # tuple is hashable, list is not
                
        if n > len(input_list):
            raise ValueError("n cannot be greater than the length of the input list")

        for template in tuple_template(n, len(input_list)):
            yield from tuples_from_template(input_list, template)

    tuples_to_cover = {t for t in tuples(input_list, n) if solver.test(t)}
    end_tuples_count = ceil(len(tuples_to_cover) * ((100 - coverage) / 100))
    end_condition = lambda: len(tuples_to_cover) <= end_tuples_count

    def tuple_score(candidate):
        if not solver.test(candidate):
            return -1
        else:
            covered_tuples = tuples_covered(candidate, n)
            score = len(tuples_to_cover.intersection(covered_tuples))
            return score

    while not end_condition():
        solver.new_test_case()
        tuple_to_cover = rand.choice(list(tuples_to_cover))
        solver.tuple_selected(tuple_to_cover)
        indices = [i for i, x in enumerate(tuple_to_cover) if x is None]
        rand.shuffle(indices)
        
        constructed_test_case = copy(tuple_to_cover)
        # print_csv_line("",constructed_test_case)
        print_csv_line(str(len(tuples_to_cover)) + ' tuples to go', constructed_test_case)
        for i in indices:
            best_choice, best_candidate, best_score = None, None, -1
            choices = input_list[i]
            rand.shuffle(choices)
            for choice in choices:
                candidate = list(copy(constructed_test_case))
                candidate[i] = choice
                clean_line()
                # print_csv_line("", candidate)
                print_csv_line(str(len(tuples_to_cover)) + ' tuples to go', candidate)
                score = tuple_score(candidate)                    
                if score > best_score:
                    best_candidate = candidate
                    best_score = tuple_score(candidate)
                    best_choice = choice
                    
            constructed_test_case = best_candidate
            solver.choice_selected(i, best_choice)
            
            for t in tuples_covered(constructed_test_case, n):
                tuples_to_cover.discard(t) 
        test_case = assigner.adapt(constructed_test_case)
        clean_line()
        yield test_case
