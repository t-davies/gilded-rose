import { IUpdateStrategy } from './default';
import { Item } from '../gilded-rose';

const APPRECIATING_ITEMS = [
  'Aged Brie',
];

/**
 * Appreciating items increase in quality as they age, once they reach
 * their sell-by-date the rate at which the appreciate doubles.
 *
 * The quality value is capped at 50.
 */
export class AppreciatingUpdateStrategy implements IUpdateStrategy {
  isSuitableFor(item: Item) {
    return APPRECIATING_ITEMS.includes(item.name);
  }

  update(item: Item) {
    if (!this.isSuitableFor(item)) {
      throw new TypeError(`Strategy unsuitable for ${item.name}`);
    }

    const updatedSellIn = item.sellIn - 1;
    const qualityIncrement = updatedSellIn < 0 ? 2 : 1;

    return {
      ...item,
      sellIn: updatedSellIn,
      quality: Math.min(50, item.quality + qualityIncrement),
    };
  }
}

export default new AppreciatingUpdateStrategy();
