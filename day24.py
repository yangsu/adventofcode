import itertools
import operator
import fileinput

packages = [int(line.strip()) for line in fileinput.input()]

target_weight = sum(packages) / 3

print target_weight


def find_combinations(all_packages, desired_sum, max_n):
    combinations = []
    for i in xrange(1, max_n + 1):
        for combination in itertools.combinations(all_packages, i):
            # print combination
            if sum(combination) == target_weight:
                combinations.append(combination)

    return combinations


def product(l):
    return reduce(lambda a, b: a * b, l, 1)

combinations = find_combinations(packages, target_weight, 6)
best = min(combinations, key=product)
print best
print product(best)
