# --- Day 20: Infinite Elves and Infinite Houses ---

# To keep the Elves busy, Santa has them deliver some presents by hand, door-to-door. He sends them down a street with infinite houses numbered sequentially: 1, 2, 3, 4, 5, and so on.

# Each Elf is assigned a number, too, and delivers presents to houses based on that number:

# The first Elf (number 1) delivers presents to every house: 1, 2, 3, 4, 5, ....
# The second Elf (number 2) delivers presents to every second house: 2, 4, 6, 8, 10, ....
# Elf number 3 delivers presents to every third house: 3, 6, 9, 12, 15, ....
# There are infinitely many Elves, numbered starting with 1. Each Elf delivers presents equal to ten times his or her number at each house.

# So, the first nine houses on the street end up like this:

# House 1 got 10 presents.
# House 2 got 30 presents.
# House 3 got 40 presents.
# House 4 got 70 presents.
# House 5 got 60 presents.
# House 6 got 120 presents.
# House 7 got 80 presents.
# House 8 got 150 presents.
# House 9 got 130 presents.
# The first house gets 10 presents: it is visited only by Elf 1, which delivers 1 * 10 = 10 presents. The fourth house gets 70 presents, because it is visited by Elves 1, 2, and 4, for a total of 10 + 20 + 40 = 70 presents.

# What is the lowest house number of the house to get at least as many presents as the number in your puzzle input?

# Your puzzle input is 29000000.
# 800280
# <702240
# ***665280***
# 693000?
# !=695520
#
max = 29000000

def factors(n):
    return [i for i in xrange(2, n / 2 + 1) if n % i is 0] + [1, n]

def factors2(n):
    return filter(lambda x: x * 50 >= n, factors(n))

def run(startI, score):
    i = startI
    presents = 0
    while presents < max:
        i += 2
        presents = reduce(lambda s, x: s + x * score, factors(i), 0)
        print i, presents
    return i

run(705500, 11)

#705600*
#720720
#730800
#740880
#750960
#<760320
#780120
#800100
