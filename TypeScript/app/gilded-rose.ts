import * as strategies from './strategies';
import { IUpdateStrategy } from './strategies/default';

export class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name: string, sellIn: number, quality: number) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

export class GildedRose {
    items: Array<Item>;
    strategies: Array<IUpdateStrategy>;

    constructor(items = [] as Array<Item>) {
        const { DefaultUpdateStrategy, ...others } = strategies;

        this.items = items;
        this.strategies = [...Object.values(others), DefaultUpdateStrategy];
    }

    updateQuality() {
        return this.items.map(item => {
            const strategy = this.strategies.find(
                strategy => strategy.isSuitableFor(item)
            );

            if (!strategy) {
                throw new Error(`Failed to match strategy for ${item.name}`);
            }

            return strategy.update(item);
        });
    }
}
