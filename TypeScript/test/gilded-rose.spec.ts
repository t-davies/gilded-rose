import { expect } from 'chai';
import { Item, GildedRose } from '../app/gilded-rose';

describe('Gilded Rose', () => {

    describe('constructor', () => {
        it('defaults to an empty array of items if nothing passed', () => {
            const gildedRose = new GildedRose();
            expect(gildedRose.items).to.be.instanceOf(Array);
            expect(() => gildedRose.updateQuality()).not.to.throw();
        });
    });

    describe('#updateQuality', () => {
        const createItem = ({ name = 'Item', sellIn, quality }) => new Item(name, sellIn, quality);
        const createAgedBrie = (options) => createItem({ name: 'Aged Brie', ...options });
        const createBackstagePasses = (options) => createItem({ name: 'Backstage passes to a TAFKAL80ETC concert', ...options });
        const createSulfuras = (options) => createItem({ name: 'Sulfuras, Hand of Ragnaros', ...options });

        it('throws if no suitable strategies are found for an item', () => {
            const gildedRose = new GildedRose([
                createItem({ sellIn: 5, quality: 2 }),
            ]);

            gildedRose.strategies = [];
            expect(() => gildedRose.updateQuality()).to.throw(/Failed to match strategy/);
        });

        it('does not allow quality to reduce below 0', () => {
            const gildedRose = new GildedRose([
                createItem({ sellIn: 10, quality: 0 }),
                createItem({ sellIn: -1, quality: 1 }), // expired items reduce by 2
            ]);

            const [updated, expired] = gildedRose.updateQuality();
            expect(updated.quality).to.equal(0);
            expect(expired.quality).to.equal(0);
        });

        describe('for regular items', () => {
            it('reduces the sell-in and quality values', () => {
                const gildedRose = new GildedRose([
                    createItem({ sellIn: 1, quality: 1 }),
                ]);

                const [updated] = gildedRose.updateQuality();
                expect(updated.sellIn).to.equal(0);
                expect(updated.quality).to.equal(0);
            });

            it('reduces quality twice as quickly once sell by date reached', () => {
                const gildedRose = new GildedRose([
                    createItem({ sellIn: 0, quality: 10 }),
                    createItem({ sellIn: -2, quality: 10 }),
                ]);

                const [zero, negative] = gildedRose.updateQuality();
                expect(zero.quality).to.equal(8);
                expect(negative.quality).to.equal(8);
            });
        });

        describe('appreciating items', () => {
            it('increases quality as sell-in decreases', () => {
                const gildedRose = new GildedRose([
                    createAgedBrie({ sellIn: 10, quality: 20 }),
                ]);

                const [updated] = gildedRose.updateQuality();
                expect(updated.sellIn).to.equal(9);
                expect(updated.quality).to.equal(21);
            });

            it('increases quality twice as quickly once sell by date reached', () => {
                /*
                    this is not in the requirements, but is true of the
                    existing behaviour, so we'll keep this test to ensure we
                    don't accidentally break any assumptions
                */
                const gildedRose = new GildedRose([
                    createAgedBrie({ sellIn: -2, quality: 10 }),
                ]);

                const [updated] = gildedRose.updateQuality();
                expect(updated.quality).to.equal(12);
            })

            it('does not allow quality to increase above 50', () => {
                const gildedRose = new GildedRose([
                    createAgedBrie({ sellIn: -1, quality: 50 }),
                    createBackstagePasses({ sellIn: 10, quality: 49 }),
                    createBackstagePasses({ sellIn: 5, quality: 48 }),
                ]);

                const updatedItems = gildedRose.updateQuality();
                expect(updatedItems.every(item => item.quality === 50)).to.be.true;
            });

            describe('time-sensitive items', () => {
                it('increases in quality as sell-in decreases', () => {
                    const gildedRose = new GildedRose([
                        createBackstagePasses({ sellIn: 14, quality: 10 }),
                    ]);

                    const [updated] = gildedRose.updateQuality();
                    expect(updated.sellIn).to.equal(13);
                    expect(updated.quality).to.equal(11);
                });

                it('increases in quality by 2 when there are 10 days or fewer left', () => {
                    const gildedRose = new GildedRose([
                        createBackstagePasses({ sellIn: 10, quality: 10 }),
                    ]);

                    const [updated] = gildedRose.updateQuality();
                    expect(updated.sellIn).to.equal(9);
                    expect(updated.quality).to.equal(12);
                });

                it('increases in quality by 3 when there are 5 days or fewer left', () => {
                    const gildedRose = new GildedRose([
                        createBackstagePasses({ sellIn: 5, quality: 10 }),
                    ]);

                    const [updated] = gildedRose.updateQuality();
                    expect(updated.sellIn).to.equal(4);
                    expect(updated.quality).to.equal(13);
                });

                it('drops quality to 0 once sell-in is reached', () => {
                    const gildedRose = new GildedRose([
                        createBackstagePasses({ sellIn: 0, quality: 10 }),
                    ]);

                    const [updated] = gildedRose.updateQuality();
                    expect(updated.sellIn).to.equal(-1);
                    expect(updated.quality).to.equal(0);
                });
            });
        });

        describe('legendary items', () => {
            it('never alters in quality', () => {
                const gildedRose = new GildedRose([
                    createSulfuras({ sellIn: 100, quality: 80 }),
                    createSulfuras({ sellIn: 0, quality: 80 }),
                    createSulfuras({ sellIn: -1, quality: 80 }),
                ]);

                const updatedItems = gildedRose.updateQuality();
                expect(updatedItems.every(item => item.quality === 80)).to.be.true;
            });

            it('never has to be sold', () => {
                const gildedRose = new GildedRose([
                    createSulfuras({ sellIn: null, quality: 80 }),
                ]);

                const [updated] = gildedRose.updateQuality();
                expect(updated.sellIn).to.equal(null);
            });
        });
    });
});
