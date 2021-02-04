import {
  Asset,
  Cash,
  newAsset,
  getTotalBalance,
  toVND,
} from "resources/transaction/transaction";
import { PriorityQueue } from "common/PriorityQueue";

class EngineConfig {
  deviationFactor: number = 10000;
  assetFactor: Asset = {
    vnd1000: 16,
    vnd2000: 8,
    vnd5000: 8,
    vnd10000: 4,
    vnd20000: 4,
    vnd50000: 4,
    vnd100000: 2,
    vnd200000: 2,
    vnd500000: 1,
  };

  getAssetValue(asset: Asset) {
    return Object.values(Cash).reduce((value: number, cash) => {
      return value + asset[cash] * this.assetFactor[cash];
    }, 0);
  }

  value(expect: number, asset: Asset) {
    return (
      Math.abs(getTotalBalance(asset) - expect) * this.deviationFactor +
      this.getAssetValue(asset)
    );
  }
}
interface State {
  asset: Asset;
  drawer: Asset;
}
const engineConfig = new EngineConfig();
const cashValues = Object.values(Cash);

const minCashIndex = (asset: Asset) =>
  cashValues.reduce((minIndex: number, current, index) => {
    if (asset[current] === 0) return minIndex;
    return index;
  }, cashValues.length);

export async function suggestAsset(
  expect: number,
  drawer: Asset,
  onFound: (suggests: PriorityQueue<Asset>) => boolean,
  limitResult: number = 3
) {
  const compareFn = (a: Asset, b: Asset) =>
    engineConfig.value(expect, a) - engineConfig.value(expect, b);
  const suggests = new PriorityQueue<Asset>(compareFn, limitResult);
  const stack: State[] = [{ asset: newAsset(), drawer: { ...drawer } }];
  const findChuck = () => {
    setTimeout(() => {
      let threshhold = 100;
      while (stack.length > 0 && threshhold > 0) {
        threshhold--;
        const current = stack.pop();
        if (current == null) break;
        const totalCurrent = getTotalBalance(current.asset);
        if (totalCurrent === expect) {
          suggests.push(current.asset);
          continue;
        }
        if (totalCurrent > expect) {
          const d = totalCurrent - expect;
          if (cashValues.filter((value) => toVND(value) === d).length > 0) {
            suggests.push(current.asset);
            continue;
          }
          continue;
        }

        const minCurrentCashIndex = minCashIndex(current.asset);
        const options: State[] = [];
        cashValues.forEach((cash, index) => {
          if (index >= minCurrentCashIndex) return;
          if (current.drawer[cash] <= 0) return;
          const cashValue = toVND(cash);
          const cashCount = Math.min(
            current.drawer[cash],
            Math.floor((expect - totalCurrent) / cashValue)
          );
          if (cashCount > 0) {
            options.push({
              asset: {
                ...current.asset,
                [cash]: current.asset[cash] + cashCount,
              },
              drawer: {
                ...current.drawer,
                [cash]: current.drawer[cash] - cashCount,
              },
            });
          }
          if (
            cashCount < current.drawer[cash] &&
            totalCurrent + cashValue * cashCount < expect
          ) {
            options.push({
              asset: {
                ...current.asset,
                [cash]: current.asset[cash] + cashCount + 1,
              },
              drawer: {
                ...current.drawer,
                [cash]: current.drawer[cash] - cashCount - 1,
              },
            });
          }
        });
        stack.push(...options);
      }
      const newSuggests = new PriorityQueue<Asset>(compareFn, 10);
      newSuggests._heap = [...suggests._heap];
      if (onFound && onFound(newSuggests) && threshhold === 0) {
        findChuck();
      }
    }, 10);
  };

  findChuck();
}
