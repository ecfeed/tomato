#!/usr/bin/env python3

import pyparsing
from pyparsing import *

def parse_expression(expression_tokens):
    while len(expression_tokens) == 1:
        expression_tokens = expression_tokens[0]
        
    if expression_tokens[0] == 'NOT':
        return NegatedExpression(expression_tokens[1:])
        
    elif any(element in expression_tokens.asList() for element in ['AND', 'OR']) and len(expression_tokens):
        # conjunction or disjunction
        rval_tokens = expression_tokens.pop()
        operator = expression_tokens.pop()
        lval_tokens = expression_tokens
        
        return CompositeExpression(lval_tokens, operator, rval_tokens)
            
    elif any(element in expression_tokens.asList() for element in ['IS', 'IS NOT', 'IN', 'NOT IN']) and len(expression_tokens) == 3:
        # primitive statement
        rval_tokens = expression_tokens.pop()
        operator = expression_tokens.pop()
        lval_tokens = expression_tokens
        
        return PrimitiveStatement(lval_tokens, operator, rval_tokens)

class CompositeExpression:
    def __init__(self, lval, operator, rval):
        self.lval = parse_expression(lval)
        self.operator = operator
        self.rval = parse_expression(rval)
        
    def __str__(self):
        return '(' + str(self.lval) + ' ' + self.operator + ' ' + str(self.rval) + ')'


class NegatedExpression:
    def __init__(self, tokens):
        self.expression = parse_expression(tokens)
        
    def __str__(self):
        return '(NOT ' + str(self.expression) + ')'

class PrimitiveStatement:
    def __init__(self, lval, operator, rval):
        self.negated = False
        if 'NOT' in operator:
            self.negated = True
        
        self.lval = lval
        
        if 'IS' in operator:
            self.allowed_values = [rval]
        elif 'IN' in operator:
            self.allowed_values = rval.asList()
            
    def __str__(self):
        return '(' + str(self.lval) + (' NOT IN ' if self.negated else ' IN ') + str(self.allowed_values) + ')'

class Invariant:
    def __init__(self, expression_tokens):
        self.expression = parse_expression(expression_tokens)

    def __str__(self):
        return str(self.expression)        
    
class Implication:
    def __init__(self, precondition_tokens, postcondition_tokens):
        self.precondition = parse_expression(precondition_tokens)
        self.postcondition = parse_expression(postcondition_tokens)
        
    def __str__(self):
        return 'IF ' + str(self.precondition) + ' THEN ' + str(self.postcondition)


def parse_constraint(constraint_string):
    is_literal = CaselessLiteral("IS")
    not_literal = CaselessLiteral("NOT")
    in_literal = CaselessLiteral("IN")

    is_relation = is_literal
    is_not_relation = Combine(is_literal + not_literal, adjacent=False, joinString=' ')
    in_relation = in_literal
    not_in_relation = Combine(not_literal + in_literal, adjacent=False, joinString=' ')

    name = QuotedString('\'', escChar='\\') | QuotedString('"', escChar='\\')
    aggregated_name = Group(Suppress('[') + name + OneOrMore(Suppress(',') + name) + Suppress(']'))

    simple_statement = name + is_relation + name | name + is_not_relation + name
    aggregate_statement = name + in_relation + aggregated_name | name + not_in_relation + aggregated_name
    primitive_statement = Group(simple_statement | aggregate_statement)

    and_literal = CaselessLiteral("AND")
    or_literal = CaselessLiteral("OR")
    logical_operator = and_literal | or_literal
    logical_operator.setResultsName('logical_operator')
    expression = Group(infixNotation(primitive_statement, 
        [
            (not_literal, 1, opAssoc.RIGHT), 
            (logical_operator, 2, opAssoc.LEFT), 
            (or_literal, 2, opAssoc.LEFT)
        ]))

    if_literal = CaselessLiteral("IF")
    then_literal = CaselessLiteral("THEN")
    implies_literal = CaselessLiteral("=>")
    implication = expression + Suppress(implies_literal) + expression | Suppress(if_literal) + expression + Suppress(then_literal) + expression
    invariant = expression
    constraint = implication | invariant

    tokens = constraint.parseString(constraint_string, parseAll=True)

    if len(tokens) == 1:
        # invariant
        return Invariant(tokens[0])
    if len(tokens) == 2:
        # implication
        return Implication(tokens[0], tokens[1])

# parse_constraint("IF 'foo' is 'bar' THEN 'biz' is 'baz'")
constraint = parse_constraint("'foo' is 'bar' AND ('biz' is 'baz' AND 'biz' is 'bar') => 'foo' is 'baz bum'")
# constraint = parse_constraint("'foo' is 'bar' AND ('biz' is 'baz' AND 'biz' is 'bar')")
print(constraint)

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