# --- Day 16: Aunt Sue ---
#
# Your Aunt Sue has given you a wonderful gift, and you'd like to send her a thank you card. However, there's a small
# problem: she signed it "From, Aunt Sue".
#
# You have 500 Aunts named "Sue".
#
# So, to avoid sending the card to the wrong person, you need to figure out which Aunt Sue (which you conveniently
# number 1 to 500, for sanity) gave you the gift. You open the present and, as luck would have it, good ol' Aunt Sue got
# you a My First Crime Scene Analysis Machine! Just what you wanted. Or needed, as the case may be.
#
# The My First Crime Scene Analysis Machine (MFCSAM for short) can detect a few specific compounds in a given sample, as
# well as how many distinct kinds of those compounds there are. According to the instructions, these are what the MFCSAM
# can detect:
#
# children, by human DNA age analysis. cats. It doesn't differentiate individual breeds. Several seemingly random breeds
# of dog: samoyeds, pomeranians, akitas, and vizslas. goldfish. No other kinds of fish. trees, all in one group. cars,
# presumably by exhaust or gasoline or something. perfumes, which is handy, since many of your Aunts Sue wear a few
# kinds. In fact, many of your Aunts Sue have many of these. You put the wrapping from the gift into the MFCSAM. It
# beeps inquisitively at you a few times and then prints out a message on ticker tape:
#
# children: 3
# cats: 7
# samoyeds: 2
# pomeranians: 3
# akitas: 0
# vizslas: 0
# goldfish: 5
# trees: 3
# cars: 2
# perfumes: 1
#
# You make a list of the things you can remember about each Aunt Sue. Things missing from your list aren't zero - you
# simply don't remember the value.
#
# What is the number of the Sue that got you the gift?
import re
import fileinput

def parse(line):
    matches = re.search(r"(\d+): (\w+): (\d+), (\w+): (\d+), (\w+): (\d+)", line)
    aunt = {'number': matches.group(1)}
    aunt[matches.group(2)] = int(matches.group(3))
    aunt[matches.group(4)] = int(matches.group(5))
    aunt[matches.group(6)] = int(matches.group(7))
    return aunt

def match(aunt, criteria, outdated=False):
    count = 0
    for k, value in aunt.iteritems():
        if k is not 'number':
            criteriaValue = criteria[k]
            if outdated and k in ['cats', 'trees']:
                if value <= criteriaValue:
                    return False
            elif outdated and k in ['pomeranians', 'goldfish']:
                if value >= criteriaValue:
                    return False
            elif value is not criteriaValue:
                return False

    return True

criteria = {
    'children': 3,
    'cats': 7,
    'samoyeds': 2,
    'pomeranians': 3,
    'akitas': 0,
    'vizslas': 0,
    'goldfish': 5,
    'trees': 3,
    'cars': 2,
    'perfumes': 1,
}

for line in fileinput.input():
    aunt = parse(line)
    # part 1
    if match(aunt, criteria):
        print aunt
    # part 2
    if match(aunt, criteria, outdated=True):
        print aunt
