# --- Day 12: JSAbacusFramework.io ---

# Santa's Accounting-Elves need help balancing the books after a recent order. Unfortunately, their accounting software uses a peculiar storage format. That's where you come in.

# They have a JSON document which contains a variety of things: arrays ([1,2,3]), objects ({"a":1, "b":2}), numbers, and strings. Your first job is to simply find all of the numbers throughout the document and add them together.

# For example:

# [1,2,3] and {"a":2,"b":4} both have a sum of 6.
# [[[3]]] and {"a":{"b":4},"c":-1} both have a sum of 3.
# {"a":[-1,1]} and [-1,{"a":1}] both have a sum of 0.
# [] and {} both have a sum of 0.
# You will not encounter any strings containing numbers.

# What is the sum of all numbers in the document?

import json
import numbers

def nestedSum(x):
    if isinstance(x, dict):
        return nestedSumHelper(list(x.values()))
    elif isinstance(x, list):
        return nestedSumHelper(x)
    elif isinstance(x, numbers.Number):
        return x
    else:
        return 0

def nestedSumHelper(listObj):
    return reduce(lambda total, x: total + nestedSum(x), listObj, 0)

def parse(jsonStr):
    jsonObj = json.loads(jsonStr)
    return nestedSum(jsonObj)

print parse('[1,2,3]')
print parse('{"a":2,"b":4}')
print parse('[[[3]]]')
print parse('{"a":{"b":4},"c":-1}')
print parse('{"a":[-1,1]}')
print parse('[-1,{"a":1}]')

import fileinput

for line in fileinput.input():
    print parse(line)
