import { SellOrder, Holding } from '../types'

type Lot = [shares: number, price: number, purchaseDate: string]

type Holdings = {
  [ticker: string]: Lot[]
}

type Output =
  | [string, string, string, string, string, string] // Output header
  | [
      ticker: string,
      originalShares: number,
      price: number,
      purchaseDate: string,
      currentShares: number,
      relievedShares: number
    ]

export default abstract class BaseMethod {
  private holdings: Holdings = {}

  protected abstract sort(holdings: Holding[]): Holding[]

  /**
   * Execute sell orders
   * @private
   * @param {SellOrder[]} sellOrders Sell orders to execute
   * @returns {Output[]} Output array
   */
  private sell(sellOrders: SellOrder[]): Output[] {
    if (Object.values(this.holdings).length <= 0) {
      throw new Error('Holdings must be sorted first')
    }

    // Go ahead and add the header to the output
    const output: Output[] = [['Tick', 'Orig Hold', 'Purch Price', 'Purch Date', 'Relvd Hold', 'Amt Relvd']]

    // Iterate through sellOrders, relieve until quantity is 0
    for (let i = 0; i < sellOrders.length; i++) {
      let [ticker, sharesToSell] = sellOrders[i]
      ticker = ticker.toLowerCase()

      if (!this.holdings[ticker]) {
        console.error(`Ticker ${ticker} not found in holdings`)
        process.exit(9)
      }

      // Iterate through, relieve until quantity is 0
      for (let j = 0; j < this.holdings[ticker].length; j++) {
        const [shares, price, purchaseDate] = this.holdings[ticker][j]

        if (sharesToSell > shares) {
          sharesToSell -= shares
          output.push([ticker, shares, price, purchaseDate, 0, shares])
        } else {
          output.push([ticker, shares, price, purchaseDate, shares - sharesToSell, sharesToSell])
          sharesToSell = 0
          break
        }
      }

      // Make sure we don't try to sell more than we have
      if (sharesToSell > 0) {
        console.error(`Not enough shares to sell for ${ticker.toUpperCase()}`)
        process.exit(9)
      }
    }

    return output
  }

  /**
   * Relieve securities
   * @param {Holding[]} holdings Holdings to relieve
   * @param {SellOrder[]} sellOrders Sell orders to execute
   * @returns {Output[]} Output array
   */
  relieve(holdings: Holding[], sellOrders: SellOrder[], allowDecimals = false): Output[] {
    if (sellOrders.length <= 0) {
      console.error('Sell orders must be provided')
      process.exit(9)
    }

    const sortedHoldings = this.sort(holdings)

    // Transform to the Holdings multidimensional array to a hashmap keyed by ticker
    for (let i = 0; i < sortedHoldings.length; i++) {
      const [ticker, shares, price, purchaseDate] = sortedHoldings[i]

      this.holdings[ticker.toLowerCase()] = [
        ...(this.holdings[ticker.toLowerCase()] || []),
        [shares, price, purchaseDate]
      ]
    }

    return this.sell(sellOrders)
  }
}
