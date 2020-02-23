import { expect } from 'chai';
import { Item } from '../../app/gilded-rose';
import { DefaultUpdateStrategy as strategy } from '../../app/strategies';

describe('DefaultUpdateStrategy', () => {
  const createItem = ({ sellIn, quality }) => new Item('Item', sellIn, quality);

  it('is suitable for all items', () => {
    const item = createItem({ sellIn: 10, quality: 10 });
    expect(strategy.isSuitableFor(item)).to.be.true;
  });

  describe('#update', () => {
    it('decreases both sell-in and quality', () => {
      const item = createItem({ sellIn: 8, quality: 10 });
      const updated = strategy.update(item);
      expect(updated.sellIn).to.equal(7);
      expect(updated.quality).to.equal(9);
    });

    it('decreases quality of expired items twice as quickly', () => {
      const items = [
        createItem({ sellIn: 0, quality: 10 }),
        createItem({ sellIn: -2, quality: 10 }),
      ];

      const updatedItems = items.map(item => strategy.update(item));
      expect(updatedItems.every(item => item.quality === 8)).to.be.true;
    });

    it('never decreases quality below zero', () => {
      const items = [
        createItem({ sellIn: 0, quality: 0 }),
        createItem({ sellIn: -2, quality: 0 }),
        createItem({ sellIn: -2, quality: 1 }), // 2x decrease if expired
      ];

      const updatedItems = items.map(item => strategy.update(item));
      expect(updatedItems.every(item => item.quality === 0)).to.be.true;
    });
  });
});
