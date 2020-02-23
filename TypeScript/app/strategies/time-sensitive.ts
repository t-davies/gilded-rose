import { IUpdateStrategy } from './default';
import { Item } from '../gilded-rose';

/**
 * Time sensitive items increase in quality, increasing more quickly as their
 * sell-in value approaches zero. They become worthless once expired.
 *
 * The quality value is capped at 50.
 */
export class TimeSensitiveUpdateStrategy implements IUpdateStrategy {
  isSuitableFor(item: Item) {
    return item.name.startsWith('Backstage passes');
  }

  getQualityIncrement(sellIn: number) {
    if (sellIn <= 5) {
      return 3;
    } else if (sellIn <= 10) {
      return 2;
    }

    return 1;
  }

  update(item: Item) {
    if (!this.isSuitableFor(item)) {
      throw new TypeError(`Strategy unsuitable for ${item.name}`);
    }

    const updatedSellIn = item.sellIn - 1;
    const qualityIncrement = this.getQualityIncrement(updatedSellIn);

    return {
      ...item,
      sellIn: updatedSellIn,
      quality: updatedSellIn > 0
        ? Math.min(50, item.quality + qualityIncrement)
        : 0
    };
  }
}

export default new TimeSensitiveUpdateStrategy();
