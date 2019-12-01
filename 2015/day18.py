import fileinput

# --- Day 18: Like a GIF For Your Yard ---

# After the million lights incident, the fire code has gotten stricter: now, at most ten thousand lights are allowed. You arrange them in a 100x100 grid.

# Never one to let you down, Santa again mails you instructions on the ideal lighting configuration. With so few lights, he says, you'll have to resort to animation.

# Start by setting your lights to the included initial configuration (your puzzle input). A # means "on", and a . means "off".

# Then, animate your grid in steps, where each step decides the next configuration based on the current one. Each light's next state (either on or off) depends on its current state and the current states of the eight lights adjacent to it (including diagonals). Lights on the edge of the grid might have fewer than eight neighbors; the missing ones always count as "off".

# For example, in a simplified 6x6 grid, the light marked A has the neighbors numbered 1 through 8, and the light marked B, which is on an edge, only has the neighbors marked 1 through 5:

# 1B5...
# 234...
# ......
# ..123.
# ..8A4.
# ..765.
# The state a light should have next is based on its current state (on or off) plus the number of neighbors that are on:

# A light which is on stays on when 2 or 3 neighbors are on, and turns off otherwise.
# A light which is off turns on if exactly 3 neighbors are on, and stays off otherwise.
# All of the lights update simultaneously; they all consider the same current state before moving to the next.

# Here's a few steps from an example configuration of another 6x6 grid:

# Initial state:
# .#.#.#
# ...##.
# #....#
# ..#...
# #.#..#
# ####..

# After 1 step:
# ..##..
# ..##.#
# ...##.
# ......
# #.....
# #.##..

# After 2 steps:
# ..###.
# ......
# ..###.
# ......
# .#....
# .#....

# After 3 steps:
# ...#..
# ......
# ...#..
# ..##..
# ......
# ......

# After 4 steps:
# ......
# ......
# ..##..
# ..##..
# ......
# ......
# After 4 steps, this example has four lights on.


def parseRow(row):
    return map(lambda x: True if x is '#' else False, list(row))

def countOnRow(row):
    return sum([item for item in row])

def countOnTable(table):
    return sum([countOnRow(row) for row in table])

def getDimensions(table):
    h = len(table)
    w = len(table[0]) if h else 0
    return [w, h]

def neighbors(table, i, j):
    w, h = getDimensions(table)
    neighborsList = []
    for x in xrange(max(0, i - 1), min(w, i + 2)):
        for y in xrange(max(0, j - 1), min(h, j + 2)):
            if not (x is i and y is j):
                neighborsList.append(table[x][y])
    return neighborsList

def step(table, alwaysOn = []):
    w, h = getDimensions(table)
    next = [row[:] for row in table]
    for i in xrange(0, w):
        row = []
        for j in xrange(0, h):
            cell = table[i][j]
            numNeighborsOn = countOnRow(neighbors(table, i, j))
            if (i, j) in alwaysOn:
                next[i][j] = True
            elif cell:
                next[i][j] = numNeighborsOn in [2, 3]
            else:
                next[i][j] = numNeighborsOn is 3
    return next


grid = [parseRow(line.strip()) for line in fileinput.input()]

numSteps = 100

w, h = getDimensions(grid)

for x in xrange(0, numSteps):
    # Part 1
    # grid = step(grid)
    # Part 2
    grid = step(grid, [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)])

print countOnTable(grid)
