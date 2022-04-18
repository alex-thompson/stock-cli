import BaseMethod from './base-method'
import { StockHolding } from '../types'

/**
 * Relieve securities in order of purchase date: last purchased (newest) is relieved first
 * @param {StockHolding[]} holdings
 * @returns {StockHolding[]} Sorted holdings
 */
export default class Lifo extends BaseMethod {
  /**
   * Sort holdings by purchase date: last purchased (newest) is relieved first
   */
  sort(holdings: StockHolding[]): StockHolding[] {
    return holdings.sort((a, b) => b[3].localeCompare(b[3]))
  }
}
