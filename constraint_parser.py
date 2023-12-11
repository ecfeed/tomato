#!/usr/bin/env python3

import pyparsing
from pyparsing import *
from constraint import *

class ConstraintLogicParser:
    def __init__(self):
        self.is_literal = CaselessLiteral("IS")
        self.not_literal = CaselessLiteral("NOT")
        self.in_literal = CaselessLiteral("IN")

        self.is_relation = self.is_literal
        self.is_not_relation = Combine(self.is_literal + self.not_literal, adjacent=False, joinString=' ')
        self.in_relation = self.in_literal
        self.not_in_relation = Combine(self.not_literal + self.in_literal, adjacent=False, joinString=' ')

        self.name = QuotedString('\'', escChar='\\') | QuotedString('"', escChar='\\')
        self.aggregated_name = Group(Suppress('[') + self.name + OneOrMore(Suppress(',') + self.name) + Suppress(']'))

        self.simple_statement = self.name + self.is_relation + self.name | self.name + self.is_not_relation + self.name
        self.aggregate_statement = self.name + self.in_relation + self.aggregated_name | self.name + self.not_in_relation + self.aggregated_name
        self.primitive_statement = Group(self.simple_statement | self.aggregate_statement)

        self.and_literal = CaselessLiteral("AND")
        self.or_literal = CaselessLiteral("OR")
        self.logical_operator = self.and_literal | self.or_literal
        self.logical_operator.setResultsName('logical_operator')
        self.expression = Group(infixNotation(self.primitive_statement, 
            [
                (self.not_literal, 1, opAssoc.RIGHT), 
                (self.logical_operator, 2, opAssoc.LEFT), 
                (self.or_literal, 2, opAssoc.LEFT)
            ]))

        self.if_literal = CaselessLiteral("IF")
        self.then_literal = CaselessLiteral("THEN")
        self.implies_literal = CaselessLiteral("=>")
        
    def parse_constraint(self, constraint_string):
        implication = self.expression + Suppress(self.implies_literal) + self.expression | Suppress(self.if_literal) + self.expression + Suppress(self.then_literal) + self.expression
        invariant = self.expression
        constraint = implication | invariant
        tokens = constraint.parseString(constraint_string, parseAll=True)
        if len(tokens) == 1:
            # invariant
            return Invariant(tokens[0])
        if len(tokens) == 2:
            # implication
            return Implication(tokens[0], tokens[1])

    def parse_assignment(self, assignment_string):
        equals_literal = CaselessLiteral("=")
        assignment_value = QuotedString('\'', escChar='\\') | Word(printables, excludeChars=',')
        assignent_statement = Group(self.name + Suppress(equals_literal) + assignment_value)
        assignents_list = Group(assignent_statement + ZeroOrMore(Suppress(',') + assignent_statement))
        
        # assignment = self.expression + Suppress(self.implies_literal) + assignents_list
        assignment = self.expression + Suppress(self.implies_literal) + assignents_list | Suppress(self.if_literal) + self.expression + Suppress(self.then_literal) + assignents_list
        return assignment.parseString(assignment_string, parseAll=True)

# def parse_constraint(constraint_string):
#     is_literal = CaselessLiteral("IS")
#     not_literal = CaselessLiteral("NOT")
#     in_literal = CaselessLiteral("IN")

#     is_relation = is_literal
#     is_not_relation = Combine(is_literal + not_literal, adjacent=False, joinString=' ')
#     in_relation = in_literal
#     not_in_relation = Combine(not_literal + in_literal, adjacent=False, joinString=' ')

#     name = QuotedString('\'', escChar='\\') | QuotedString('"', escChar='\\')
#     aggregated_name = Group(Suppress('[') + name + OneOrMore(Suppress(',') + name) + Suppress(']'))

#     simple_statement = name + is_relation + name | name + is_not_relation + name
#     aggregate_statement = name + in_relation + aggregated_name | name + not_in_relation + aggregated_name
#     primitive_statement = Group(simple_statement | aggregate_statement)

#     and_literal = CaselessLiteral("AND")
#     or_literal = CaselessLiteral("OR")
#     logical_operator = and_literal | or_literal
#     logical_operator.setResultsName('logical_operator')
#     expression = Group(infixNotation(primitive_statement, 
#         [
#             (not_literal, 1, opAssoc.RIGHT), 
#             (logical_operator, 2, opAssoc.LEFT), 
#             (or_literal, 2, opAssoc.LEFT)
#         ]))

#     if_literal = CaselessLiteral("IF")
#     then_literal = CaselessLiteral("THEN")
#     implies_literal = CaselessLiteral("=>")
#     implication = expression + Suppress(implies_literal) + expression | Suppress(if_literal) + expression + Suppress(then_literal) + expression
#     invariant = expression
#     constraint = implication | invariant

#     tokens = constraint.parseString(constraint_string, parseAll=True)

#     if len(tokens) == 1:
#         # invariant
#         return Invariant(tokens[0])
#     if len(tokens) == 2:
#         # implication
#         return Implication(tokens[0], tokens[1])

# def parse_assignment(assignment_string):
#     assignment = Group(QuotedString('\'', escChar='\\') + Suppress('=') + QuotedString('\'', escChar='\\'))
#     tokens = assignment.parseString(assignment_string, parseAll=True)
#     print(f'tokens: {tokens}')
#     return Assignment(tokens[0], tokens[1])

# parse_constraint("IF 'foo' is 'bar' THEN 'biz' is 'baz'")
# constraint = parse_constraint("'foo' is 'bar' AND ('biz' is 'baz' AND 'biz' is 'bar') => 'foo' is 'baz bum'")
# constraint = parse_constraint("'foo' is 'bar' AND ('biz' is 'baz' AND 'biz' is 'bar')")
# print(constraint)

# parse_constraint("NOT 'foo' is 'bar'")


# expression.runTests("""
#     # 'foo' is 'bar'
#     # 'foo' is 'bar' AND 'biz' is 'baz'
#     # 'foo' is 'bar' OR 'biz' is 'baz'
#     # 'foo' is 'bar' AND 'biz' is 'baz' OR 'biz' is 'bar'
#     # 'foo' is 'bar' OR 'biz' is 'baz' AND 'biz' is 'bar'
    
#     # 'foo' is 'bar' AND ('biz' is 'baz' AND 'biz' is 'bar')
#     # 'foo' is 'bar' OR 'biz' is 'baz' OR 'biz' is 'bar'
    
#     # 'foo' is in ['bar', 'baz'] AND 'biz' is in ['baz', 'bar'] OR 'biz' is 'baz'
    
#     # NOT ('foo' is 'bar' AND 'biz' is 'baz')
#     ('foo' is 'bar' AND 'biz' is 'baz') OR ('biz' is 'baz' AND ('biz' is 'bar' OR 'biz' is 'foo'))
#     """)
    

# primitive_statement.runTests("""
#     'foo' is 'bar'
#     'foo bar' is 'bar biz'
#     'foo biz' is 'bar'
#     'foo' is 'biz bar'
        
#     'foo' is not 'bar'
#     'foo bar' is not 'bar biz'
#     'foo biz' is not 'bar'
#     'foo' is not 'biz bar'    
    
#     'foo' in ["bar", "baz"]
#     'foo bar' in ["biz bar", "baz biz"]
#     'foo biz' in ["bar", "baz baz"]
#     'foo' in ["biz bar", "baz biz"]
    
#     'foo' not in ["bar", "baz"]
#     'foo bar' not in ["biz bar", "baz biz"]
#     'foo biz' not in ["bar", "baz baz"]
#     'foo' not in ["biz bar", "baz biz"]
    
#                         """)