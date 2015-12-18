# --- Day 14: Reindeer Olympics ---

# This year is the Reindeer Olympics! Reindeer can fly at high speeds, but must rest occasionally to recover their energy. Santa would like to know which of his reindeer is fastest, and so he has them race.

# Reindeer can only either be flying (always at their top speed) or resting (not moving at all), and always spend whole seconds in either state.

# For example, suppose you have the following Reindeer:

# Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
# Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.

# After one second, Comet has gone 14 km, while Dancer has gone 16 km. After ten seconds, Comet has gone 140 km, while Dancer has gone 160 km. On the eleventh second, Comet begins resting (staying at 140 km), and Dancer continues on for a total distance of 176 km. On the 12th second, both reindeer are resting. They continue to rest until the 138th second, when Comet flies for another ten seconds. On the 174th second, Dancer flies for another 11 seconds.

# In this example, after the 1000th second, both reindeer are resting, and Comet is in the lead at 1120 km (poor Dancer has only gotten 1056 km by that point). So, in this situation, Comet would win (if the race ended at 1000 seconds).

# Given the descriptions of each reindeer (in your puzzle input), after exactly 2503 seconds, what distance has the winning reindeer traveled?

import re

facts = [
    'Rudolph can fly 22 km/s for 8 seconds, but then must rest for 165 seconds.',
    'Cupid can fly 8 km/s for 17 seconds, but then must rest for 114 seconds.',
    'Prancer can fly 18 km/s for 6 seconds, but then must rest for 103 seconds.',
    'Donner can fly 25 km/s for 6 seconds, but then must rest for 145 seconds.',
    'Dasher can fly 11 km/s for 12 seconds, but then must rest for 125 seconds.',
    'Comet can fly 21 km/s for 6 seconds, but then must rest for 121 seconds.',
    'Blitzen can fly 18 km/s for 3 seconds, but then must rest for 50 seconds.',
    'Vixen can fly 20 km/s for 4 seconds, but then must rest for 75 seconds.',
    'Dancer can fly 7 km/s for 20 seconds, but then must rest for 119 seconds.',
]

contestants = []

def parseFact(fact):
    matches = re.search(r"(\w+) .+ (\d+) .+ (\d+) .+ (\d+)", fact)
    contestant = matches.group(1)
    speed = int(matches.group(2))
    limit = int(matches.group(3))
    rest = int(matches.group(4))
    return {
        'contestant': contestant,
        'speed': speed,
        'limit': limit,
        'rest': rest
    }


contestants = [parseFact(fact) for fact in facts]

def byDistance(time):
    def byDistanceForTime(contestant):
        fullCycleTime = contestant['limit'] + contestant['rest']
        cycles = time / fullCycleTime
        distance = contestant['speed'] * (contestant['limit'] * cycles + min(time % fullCycleTime, contestant['limit']))
        return distance
    return byDistanceForTime

print max(map(byDistance(2503), contestants))
