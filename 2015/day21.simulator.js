import _ from 'lodash';

const storeData = {
  Weapons: [
    'Dagger        8     4       0',
    'Shortsword   10     5       0',
    'Warhammer    25     6       0',
    'Longsword    40     7       0',
    'Greataxe     74     8       0',
  ],
  Armor: [
    'Leather      13     0       1',
    'Chainmail    31     0       2',
    'Splintmail   53     0       3',
    'Bandedmail   75     0       4',
    'Platemail   102     0       5',
  ],
  Rings: [
    'Damage +1    25     1       0',
    'Damage +2    50     2       0',
    'Damage +3   100     3       0',
    'Defense +1   20     0       1',
    'Defense +2   40     0       2',
    'Defense +3   80     0       3',
  ],
};

const regex = /(\w+|\w+ \+\d+)\s+(\d+)\s+(\d+)\s+(\d+)/;

export class RGPSimulator {
  constructor() {
    this.store = this.parseStoreData(storeData);
  }

  parseStoreData(data) {
    return _.mapValues(data, (items) => {
      return items.map(item => {
        const [_match, name, cost, damage, armor] = item.match(regex);
        return {name, cost: parseInt(cost, 10), damage: parseInt(damage, 10), armor: parseInt(armor, 10)};
      });
    });
  }

  calculateHits(defender, attacker) {
    return Math.ceil(defender.hp / Math.max(1, attacker.damage - defender.armor));
  }

  computeResult(player, boss) {
    const playerHitsToDeath = this.calculateHits(player, boss);
    const bossHitsToDeath = this.calculateHits(boss, player);
    return (playerHitsToDeath + 1) >= bossHitsToDeath;
  }

  equipItems(player, items) {
    return items.reduce((playerWithItems, {damage, armor}) => {
      playerWithItems.damage += damage;
      playerWithItems.armor += armor;
      return playerWithItems;
    }, _.clone(player));
  }

  computeCost(items) {
    return items.reduce((total, {cost}) => total + cost, 0);
  }

  selectN(items, n) {
    if (items.length === 0 || n <= 0) {
      return [[]];
    } else if (items.length === n) {
      return [items];
    } else if (n === 1) {
      return items.map(item => [item]);
    }
    return items.reduce((memo, item, i) => {
      const rest = items.slice(i + 1);
      const combinations = this.selectN(rest, n - 1).map(selected => [item].concat(selected));
      return memo.concat(combinations);
    }, []);
  }

  generateCombinationsHash(configuration) {
    if (_.isEmpty(configuration)) {
      return [];
    }
    return _.reduce(configuration, (combinations, [minNumber, maxNumber], itemType) => {
      const items = _.range(minNumber, maxNumber + 1).reduce((memo, max) => {
        return memo.concat(this.selectN(this.store[itemType], max));
      }, []);
      combinations[itemType] = items;
      return combinations;
    }, {});
  }

  computeProduct(...lists) {
    if (lists.length === 0) {
      return [];
    } else if (lists.length === 1) {
      return lists[0];
    }
    const head = _.head(lists);
    const rest = _.rest(lists);
    const restCombinations = this.computeProduct(...rest);

    return _.reduce(head, (memo, list) => {
      const newCombinations = restCombinations.map(combination => list.concat(combination));
      return memo.concat(newCombinations);
    }, []);
  }

  generateCombinations(configuration) {
    const combinationHash = this.generateCombinationsHash(configuration);
    return this.computeProduct(..._.values(combinationHash));
  }

  findBestWinningCombinationCost(player, boss, configuration) {
    const costs = this.generateCombinations(configuration)
      .filter(items => this.computeResult(this.equipItems(player, items), boss))
      .map(this.computeCost);
    return _.min(costs);
  }

  findWorstLosingCombinationCost(player, boss, configuration) {
    const costs = this.generateCombinations(configuration)
      .filter(items => !this.computeResult(this.equipItems(player, items), boss))
      .map(this.computeCost);
    return _.max(costs);
  }
}
