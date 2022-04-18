import BaseMethod from './base-method'
import { Holding } from '../types'

/**
 * Relieve securities in order of purchase date: first purchased (oldest) is relieved first
 * @param {Holding[]} holdings
 * @returns {Holding[]} Sorted holdings
 */
export default class Fifo extends BaseMethod {
  /**
   * Sort holdings by purchase date: first purchased (oldest) is relieved first
   */
  sort(holdings: Holding[]): Holding[] {
    return holdings.sort((a, b) => a[3].localeCompare(b[3]))
  }
}
