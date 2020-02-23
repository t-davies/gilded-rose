import { IUpdateStrategy } from './default';
import { Item } from '../gilded-rose';

const LEGENDARY_ITEMS = [
  'Sulfuras, Hand of Ragnaros',
];

/**
 * Legendary items need never to be sold and do not alter in quality.
 */
export class LegendaryUpdateStrategy implements IUpdateStrategy {
  isSuitableFor(item: Item) {
    return LEGENDARY_ITEMS.includes(item.name);
  }

  update(item: Item) {
    if (!this.isSuitableFor(item)) {
      throw new TypeError(`Strategy unsuitable for ${item.name}`);
    }

    return item;
  }
}

export default new LegendaryUpdateStrategy();
