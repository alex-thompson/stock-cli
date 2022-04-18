#!/usr/bin/env node
// import clear from 'clear'
import { read } from './lib/read'
import { Fifo, Hifo, Lifo } from './methods'
import { ReliefMethod, SellOrder, StockHolding } from './types'

// TODO: Update these
const reliefMethods = {
  [ReliefMethod.FIFO]: new Fifo(),
  [ReliefMethod.LIFO]: new Lifo(),
  [ReliefMethod.HIFO]: new Hifo()
}

const relieve = (
  holdings: StockHolding[],
  sellOrders: SellOrder[],
  reliefMethod: ReliefMethod,
  allowDecimals = false
) => {
  if (!reliefMethods[reliefMethod]) {
    throw new Error(`Invalid relief method: ${reliefMethod}`)
  }

  const reliefResult = reliefMethods[reliefMethod].relieve(holdings, sellOrders)
  console.log('reliefResult: ', reliefResult)
}

// TODO: Update to use CLI
const main = async () => {
  const holdings = (await read(`${__dirname}/holdings.csv`)) as StockHolding[]
  const sellOrders = (await read(`${__dirname}/sell-orders.csv`)) as SellOrder[]

  const _method: string = 'fifo'

  let reliefMethod: ReliefMethod = ReliefMethod.FIFO

  if (Object.values(ReliefMethod).some((method: string) => method === _method.toLowerCase())) {
    reliefMethod = <ReliefMethod>_method
  } else {
    throw new Error(`Invalid relief method: ${_method}`)
  }
  // console.log('reliefMethod: ', reliefMethod)

  relieve(holdings, sellOrders, reliefMethod)
}

main()
