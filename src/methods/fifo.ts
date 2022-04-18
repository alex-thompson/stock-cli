import BaseMethod from './base-method'
import { StockHolding } from '../types'

/**
 * Relieve securities in order of purchase date: first purchased (oldest) is relieved first
 * @param {StockHolding[]} holdings
 * @returns {StockHolding[]} Sorted holdings
 */
export default class Fifo extends BaseMethod {
  /**
   * Sort holdings by purchase date: first purchased (oldest) is relieved first
   */
  sort(holdings: StockHolding[]): StockHolding[] {
    return holdings.sort((a, b) => a[3].localeCompare(b[3]))
  }
}
