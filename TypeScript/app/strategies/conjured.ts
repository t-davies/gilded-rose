import { DefaultUpdateStrategy } from "./default";
import { Item } from "../gilded-rose";

/**
 * Conjured items behave per the default strategy, but they decrease
 * in quality twice as quickly.
 */
export class ConjuredUpdateStrategy extends DefaultUpdateStrategy {
  isSuitableFor(item: Item) {
    return item.name.startsWith('Conjured');
  }
}

export default new ConjuredUpdateStrategy({ multiplier: 2 });
