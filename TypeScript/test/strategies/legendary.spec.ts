import { expect } from 'chai';
import { Item } from '../../app/gilded-rose';
import { LegendaryUpdateStrategy as strategy } from '../../app/strategies';

describe('LegendaryUpdateStrategy', () => {
  const createLegendaryItem = ({ sellIn, quality }) => new Item('Sulfuras, Hand of Ragnaros', sellIn, quality);

  it('is not suitable for regular items', () => {
    const item = new Item('Regular Item', 0, 1);
    expect(strategy.isSuitableFor(item)).to.be.false;
  });

  it('is suitable for "Sulfuras, Hand of Ragnaros"', () => {
    const item = createLegendaryItem({ sellIn: 10, quality: 10 });
    expect(strategy.isSuitableFor(item)).to.be.true;
  });

  describe('#update', () => {
    it('throws if called with an unsuitable item', () => {
      expect(
        () => strategy.update(new Item('Basic', 1, 1))
      ).to.throw(TypeError);
    });

    it('never alters the quality', () => {
      const items = [
        createLegendaryItem({ sellIn: 100, quality: 80 }),
        createLegendaryItem({ sellIn: 0, quality: 80 }),
        createLegendaryItem({ sellIn: -1, quality: 80 }),
      ];

      const updatedItems = items.map(item => strategy.update(item));
      expect(updatedItems.every(item => item.quality === 80)).to.be.true;
    });

    it('never has to be sold', () => {
      const items = [
        createLegendaryItem({ sellIn: 100, quality: 80 }),
        createLegendaryItem({ sellIn: 0, quality: 80 }),
        createLegendaryItem({ sellIn: -1, quality: 80 }),
      ];

      const [positive, zero, negative] = items.map(item => strategy.update(item));
      expect(positive.sellIn).to.equal(100);
      expect(zero.sellIn).to.equal(0);
      expect(negative.sellIn).to.equal(-1);
    });
  });
});
