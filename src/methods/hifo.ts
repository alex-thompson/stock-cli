import BaseMethod from './base-method'
import { StockHolding } from '../types'

// TODO: A real implemention would sort by tax liability, not just the purchase price?
/**
 * Relieve securities in order of purchase price: highest price is relieved first
 * @param {StockHolding[]} holdings
 * @returns {StockHolding[]} Sorted holdings
 */
export default class Hifo extends BaseMethod {
  /**
   * Sort holdings by purchase price: highest price is relieved first
   */
  sort(holdings: StockHolding[]): StockHolding[] {
    // return holdings.sort((a, b) => b[3].localeCompare(b[3]))
    return holdings.sort((a, b) => b[2] - a[2])
  }
}
