import { SellOrder, StockHolding } from '../types'

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

  protected abstract sort(holdings: StockHolding[]): StockHolding[]

  private sell(sellOrders: SellOrder[]): Output[] {
    if (Object.values(this.holdings).length <= 0) {
      throw new Error('Holdings must be sorted first')
    }

    const output: Output[] = [['Tick', 'Orig Hold', 'Purch Price', 'Purch Date', 'Relvd Hold', 'Amt Relvd']]

    // console.log('selling for...')
    // console.log(JSON.stringify(this.holdings, null, 2))
    // console.log(sellOrders)

    // Iterate through sellList, relieve until quantity is 0
    for (let i = 0; i < sellOrders.length; i++) {
      let [ticker, sharesToSell] = sellOrders[i]
      ticker = ticker.toLowerCase()

      if (!this.holdings[ticker]) {
        throw new Error(`Ticker ${ticker} not found in holdings`)
      }

      // Iterate through, relieve until quantity is 0
      for (let j = 0; j < this.holdings[ticker].length; j++) {
        const [shares, price, purchaseDate] = this.holdings[ticker][j]

        if (sharesToSell > shares) {
          sharesToSell -= shares
          output.push([ticker, shares, price, purchaseDate, 0, shares])
        } else {
          output.push([ticker, shares, price, purchaseDate, shares - sharesToSell, sharesToSell])
          break
        }
      }
    }

    return output
  }

  relieve(holdings: StockHolding[], sellOrders: SellOrder[]): Output[] {
    if (sellOrders.length <= 0) {
      throw new Error('Sell orders must be provided')
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
