import copy

spell_costs = {
    'Magic Missile': 53,
    'Drain': 73,
    'Shield': 113,
    'Poison': 173,
    'Recharge': 229,
}
spells = spell_costs.keys()


class Game(object):
    def __init__(self, *args, **kwargs):
        prop_defaults = {
            'wizard_hp': 0,
            'wizard_mana': 0,
            'wizard_armor': 0,
            'boss_hp': 0,
            'boss_damage': 0,
            'recharge_left': 0,
            'poison_left': 0,
            'shield_left': 0,
            'debug': False,
        }
        for prop, default in prop_defaults.iteritems():
            setattr(self, prop, kwargs.get(prop, default))
        self.turn = 0
        self.total_mana = 0

    def __print(self, msg):
        if self.debug:
            print(msg)

    def wizard_alive(self):
        return self.wizard_hp > 0

    def should_continue(self):
        return self.boss_hp > 0 and self.wizard_alive()

    def print_status(self):
        if self.turn % 2 == 0:
            self.__print('-- Player turn -- %d' % self.turn)
        else:
            self.__print('-- Boss turn -- %d' % self.turn)
        self.__print('- Player has %d hit points, %d armor, %d mana' % (self.wizard_hp, self.wizard_armor, self.wizard_mana))
        self.__print('- Boss has %d hit points' % self.boss_hp)

    def __boss_attacks(self):
        damage = max(1, self.boss_damage - self.wizard_armor)
        self.wizard_hp -= damage
        self.__print('Boss attacks for %d damage!' % damage)

    def __print_wears_off(self, spell, turns_left):
        if not turns_left:
            self.__print('%s wears off.' % spell)

    def apply_spells(self):
        if self.recharge_left:
            self.recharge_left = max(self.recharge_left - 1, 0)
            self.wizard_mana += 101
            self.__print('Recharge provides 101 wizard_mana; its timer is now %d.' % self.recharge_left)
            self.__print_wears_off('Recharge', self.recharge_left)
        if self.poison_left:
            self.poison_left = max(self.poison_left - 1, 0)
            self.boss_hp -= 3
            self.__print('Poison deals 3 damage; its timer is now %d.' % self.poison_left)
            self.__print_wears_off('Poison', self.poison_left)
        if self.shield_left:
            self.shield_left = max(self.shield_left - 1, 0)
            self.wizard_armor = 7
            self.__print("Shield's timer is now %d." % self.shield_left)
            self.__print_wears_off('Shield', self.shield_left)
        else:
            self.wizard_armor = 0

    def __cast_spell(self, spell):
        if spell == 'Shield':
            self.shield_left = 6
        elif spell == 'Recharge':
            self.recharge_left = 5
        elif spell == 'Poison':
            self.poison_left = 6
        elif spell == 'Magic Missile':
            self.boss_hp -= 4
        elif spell == 'Drain':
            self.boss_hp -= 2
            self.wizard_hp += 2

        cost = spell_costs[spell]
        self.total_mana += cost
        self.wizard_mana -= cost
        self.__print('Player casts %s.' % spell)

    def can_cast(self, spell):
        has_enough_mana = self.wizard_mana >= spell_costs[spell]
        if spell == 'Shield':
            return not self.shield_left and has_enough_mana
        elif spell == 'Recharge':
            return not self.recharge_left and has_enough_mana
        elif spell == 'Poison':
            return not self.poison_left and has_enough_mana
        else:
            return has_enough_mana

    def play(self, spell=''):
        if self.turn % 2 == 0:
            self.__cast_spell(spell)
        else:
            self.__boss_attacks()

        if not self.should_continue():
            self.__print('%s wins. total mana: %d' % ('Wizard' if self.wizard_alive() else 'Boss', self.total_mana))
        self.__print('')
        self.turn += 1

# game = Game(wizard_hp=10, wizard_mana=250, boss_hp=13, boss_damage=8)
# game = Game(wizard_hp=10, wizard_mana=250, boss_hp=14, boss_damage=8)
game = Game(wizard_hp=50, wizard_mana=500, boss_hp=58, boss_damage=9)

queue = [game]

minimum_mana = float('inf')
part2 = True

while len(queue) > 0:
    head = queue.pop(0)
    if head.should_continue() and head.total_mana < minimum_mana:
        head.print_status()
        head.apply_spells()
        if head.turn % 2 == 0:
            if part2:
                head.wizard_hp -= 1
            for spell in spells:
                if head.can_cast(spell) and head.should_continue():
                    new_game = copy.copy(head)
                    new_game.play(spell)
                    queue.append(new_game)
        else:
            head.play()
            queue.append(head)
    else:
        if head.wizard_alive() and not head.should_continue():
            print "Wizard won at #%d, with total wizard_mana %d" % (head.turn, head.total_mana)
            minimum_mana = min(head.total_mana, minimum_mana)

print minimum_mana
