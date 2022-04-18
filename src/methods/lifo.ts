import BaseMethod from './base-method'
import { Holding } from '../types'

/**
 * Relieve securities in order of purchase date: last purchased (newest) is relieved first
 * @param {Holding[]} holdings
 * @returns {Holding[]} Sorted holdings
 */
export default class Lifo extends BaseMethod {
  /**
   * Sort holdings by purchase date: last purchased (newest) is relieved first
   */
  sort(holdings: Holding[]): Holding[] {
    return holdings.sort((a, b) => b[3].localeCompare(b[3]))
  }
}
