import { expect } from 'chai';
import { Item } from '../../app/gilded-rose';
import { TimeSensitiveUpdateStrategy as strategy } from '../../app/strategies';

describe('TimeSensitiveUpdateStrategy', () => {
  const createPasses = ({ sellIn, quality }) => new Item('Backstage passes', sellIn, quality);

  it('is not suitable for regular items', () => {
    const item = new Item('Regular Item', 0, 1);
    expect(strategy.isSuitableFor(item)).to.be.false;
  });

  it('is suitable for "Backstage passes"', () => {
    const item = createPasses({ sellIn: 10, quality: 10 });
    expect(strategy.isSuitableFor(item)).to.be.true;
  });

  describe('#update', () => {
    it('throws if called with an unsuitable item', () => {
      expect(
        () => strategy.update(new Item('Basic', 1, 1))
      ).to.throw(TypeError);
    });

    it('increases in quality as sell-in decreases', () => {
      const item = createPasses({ sellIn: 12, quality: 20 });
      const updated = strategy.update(item);
      expect(updated.sellIn).to.equal(11);
      expect(updated.quality).to.equal(21);
    });

    it('increases in quality by 2 when there are 10 days or fewer left', () => {
      const item = createPasses({ sellIn: 10, quality: 20 });
      const updated = strategy.update(item);
      expect(updated.sellIn).to.equal(9);
      expect(updated.quality).to.equal(22);
    });

    it('increases in quality by 3 when there are 5 days or fewer left', () => {
      const item = createPasses({ sellIn: 5, quality: 20 });
      const updated = strategy.update(item);
      expect(updated.sellIn).to.equal(4);
      expect(updated.quality).to.equal(23);
    });

    it('drops quality to zero when sell-in has passed', () => {
      const items = [
        createPasses({ sellIn: 0, quality: 50 }),
        createPasses({ sellIn: -1, quality: 36 }),
        createPasses({ sellIn: -100, quality: 0 }),
        createPasses({ sellIn: 0, quality: -2 }),
      ];

      const updatedItems = items.map(item => strategy.update(item));
      expect(updatedItems.every(item => item.quality === 0)).to.be.true;
    });

    it('never increases quality above 50', () => {
      const items = [
        createPasses({ sellIn: 12, quality: 50 }),
        createPasses({ sellIn: 10, quality: 49 }), // 2x increase
        createPasses({ sellIn: 5, quality: 48 }), // 3x increase
      ];

      const updatedItems = items.map(item => strategy.update(item));
      expect(updatedItems.every(item => item.quality === 50)).to.be.true;
    })
  });
});
