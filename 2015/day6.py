# --- Day 6: Probably a Fire Hazard ---

# Because your neighbors keep defeating you in the holiday house decorating contest year after year, you've decided to deploy one million lights in a 1000x1000 grid.

# Furthermore, because you've been especially nice this year, Santa has mailed you instructions on how to display the ideal lighting configuration.

# Lights in your grid are numbered from 0 to 999 in each direction; the lights at each corner are at 0,0, 0,999, 999,999, and 999,0. The instructions include whether to turn on, turn off, or toggle various inclusive ranges given as coordinate pairs. Each coordinate pair represents opposite corners of a rectangle, inclusive; a coordinate pair like 0,0 through 2,2 therefore refers to 9 lights in a 3x3 square. The lights all start turned off.

# To defeat your neighbors this year, all you have to do is set up your lights by doing the instructions Santa sent you in order.

# For example:

# turn on 0,0 through 999,999 would turn on (or leave on) every light.
# toggle 0,0 through 999,0 would toggle the first line of 1000 lights, turning off the ones that were on, and turning on the ones that were off.
# turn off 499,499 through 500,500 would turn off (or leave off) the middle four lights.
# After following the instructions, how many lights are lit?

import re
import fileinput

lights = [[0 for x in range(1000)] for y in range(1000)]

def operate(x1, y1, x2, y2, valueFunction):
    for x in xrange(x1, x2 + 1):
        for y in xrange(y1, y2 + 1):
            lights[x][y] = valueFunction(lights[x][y])
def count():
    return reduce(lambda count, row: count + sum(row), lights, 0)

noop = lambda x: x

def executeCommand(input, on, off, toggle):
    matches = re.search(r"([\w\s]+)\s(\d+),(\d+) through (\d+),(\d+)", input)
    command = matches.group(1)
    x1 = int(matches.group(2))
    y1 = int(matches.group(3))
    x2 = int(matches.group(4))
    y2 = int(matches.group(5))

    op = noop
    if command == 'turn on':
        op = on
    elif command == 'turn off':
        op = off
    elif command == 'toggle':
        op = toggle

    operate(x1, y1, x2, y2, op)

# Part 1
# for line in fileinput.input():
#     executeCommand(
#         line,
#         on = lambda x: 1,
#         off = lambda x: 0,
#         toggle = lambda x: int(not bool(x))
#     )

# Part 2
for line in fileinput.input():
    executeCommand(
        line,
        on = lambda x: x + 1,
        off = lambda x: max(x - 1, 0),
        toggle = lambda x: x + 2
    )

print count()


