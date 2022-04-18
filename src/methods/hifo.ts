import BaseMethod from './base-method'
import { Holding } from '../types'

// TODO: A real implemention would sort by tax liability, not just the purchase price?
/**
 * Relieve securities in order of purchase price: highest price is relieved first
 * @param {Holding[]} holdings
 * @returns {Holding[]} Sorted holdings
 */
export default class Hifo extends BaseMethod {
  /**
   * Sort holdings by purchase price: highest price is relieved first
   */
  sort(holdings: Holding[]): Holding[] {
    // return holdings.sort((a, b) => b[3].localeCompare(b[3]))
    return holdings.sort((a, b) => b[2] - a[2])
  }
}
