import { Item } from "../gilded-rose";

export interface IUpdateStrategy {
  /**
   * Updates the item according to the strategy, returning a copy of the
   * item with it's values updated.
   * @param item the item to update
   */
  update(item: Item): Item;

  /**
   * Determines if this strategy is suitable for an item.
   * @param item the item to the check suitability of this strategy for
   */
  isSuitableFor(item: Item): boolean;
}

/**
 * The default behaviour of items is to decrease both sell-in and quality,
 * once an item has expired it decreases in quality twice as quickly.
 *
 * The value of quality can not go below 0.
 */
export class DefaultUpdateStrategy implements IUpdateStrategy {
  multiplier: number;

  constructor({ multiplier = 1 } = {}) {
    this.multiplier = multiplier;
  }

  isSuitableFor(item: Item) {
    return true;
  }

  update(item: Item) {
    const updatedSellIn = item.sellIn - 1;
    const qualityDecrement = updatedSellIn < 0 ? 2 : 1;

    return {
      ...item,
      sellIn: updatedSellIn,
      quality: Math.max(0, item.quality - (qualityDecrement * this.multiplier)),
    }
  }
}

export default new DefaultUpdateStrategy();
