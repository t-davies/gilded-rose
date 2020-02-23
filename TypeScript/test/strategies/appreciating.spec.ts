import { expect } from 'chai';
import { Item } from '../../app/gilded-rose';
import { AppreciatingUpdateStrategy as strategy } from '../../app/strategies';

describe('AppreciatingUpdateStrategy', () => {
  const createBrie = ({ sellIn, quality }) => new Item('Aged Brie', sellIn, quality);

  it('is not suitable for regular items', () => {
    const item = new Item('Regular Item', 0, 1);
    expect(strategy.isSuitableFor(item)).to.be.false;
  });

  it('is suitable for "Aged Brie"', () => {
    const item = createBrie({ sellIn: 10, quality: 10 });
    expect(strategy.isSuitableFor(item)).to.be.true;
  });

  describe('#update', () => {
    it('throws if called with an unsuitable item', () => {
      expect(
        () => strategy.update(new Item('Basic', 1, 1))
      ).to.throw(TypeError);
    });

    it('increases in quality as sell-in decreases', () => {
      const item = createBrie({ sellIn: 10, quality: 20 });
      const updated = strategy.update(item);
      expect(updated.sellIn).to.equal(9);
      expect(updated.quality).to.equal(21);
    });

    it('increases quality of expired items twice as quickly', () => {
      const items = [
        createBrie({ sellIn: 0, quality: 20 }),
        createBrie({ sellIn: -2, quality: 20 }),
      ];

      const updatedItems = items.map(item => strategy.update(item));
      expect(updatedItems.every(item => item.quality === 22)).to.be.true;
    });

    it('never increases quality above 50', () => {
      const items = [
        createBrie({ sellIn: 10, quality: 50 }),
        createBrie({ sellIn: 10, quality: 49 }),
        createBrie({ sellIn: 0, quality: 49 }),
        createBrie({ sellIn: -2, quality: 49 }), // 2x increase if expired
      ];

      const updatedItems = items.map(item => strategy.update(item));
      expect(updatedItems.every(item => item.quality === 50)).to.be.true;
    })
  });
});
