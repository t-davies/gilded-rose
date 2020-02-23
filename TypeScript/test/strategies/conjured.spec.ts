import { expect } from 'chai';
import { Item } from '../../app/gilded-rose';
import { ConjuredUpdateStrategy as strategy } from '../../app/strategies';

describe('ConjuredUpdateStrategy', () => {
  const createItem = ({ sellIn, quality }) => new Item('Conjured Jam', sellIn, quality);

  it('is not suitable for regular items', () => {
    const item = new Item('Boring', 2, 1);
    expect(strategy.isSuitableFor(item)).to.be.false;
  });

  it('is suitable for "Conjured" items', () => {
    const item = createItem({ sellIn: 10, quality: 10 });
    expect(strategy.isSuitableFor(item)).to.be.true;
  });

  describe('#update', () => {
    it('decreases sell-in by 1 and quality by 2', () => {
      const item = createItem({ sellIn: 8, quality: 10 });
      const updated = strategy.update(item);
      expect(updated.sellIn).to.equal(7);
      expect(updated.quality).to.equal(8);
    });

    it('decreases quality of expired items twice as quickly', () => {
      const items = [
        createItem({ sellIn: 0, quality: 10 }),
        createItem({ sellIn: -2, quality: 10 }),
      ];

      const updatedItems = items.map(item => strategy.update(item));
      expect(updatedItems.every(item => item.quality === 6)).to.be.true;
    });

    it('never decreases quality below zero', () => {
      const items = [
        createItem({ sellIn: 0, quality: 0 }),
        createItem({ sellIn: -2, quality: 0 }),
        createItem({ sellIn: -2, quality: 3 }), // 2x decrease if expired
      ];

      const updatedItems = items.map(item => strategy.update(item));
      expect(updatedItems.every(item => item.quality === 0)).to.be.true;
    });
  });
});
