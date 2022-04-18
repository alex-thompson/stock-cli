#!/usr/bin/env node
import { program } from 'commander'
import { clear } from 'console'
// import Papa from 'papaparse'

import { read } from './lib/read'
import { Fifo, Hifo, Lifo } from './methods'
import { SellOrder, Holding } from './types'

enum ReliefMethod {
  FIFO = 'fifo',
  LIFO = 'lifo',
  HIFO = 'hifo'
}

/**
 * Main "thread" called by commander
 * @param {string} holdingsFile CSV of holdings
 * @param {string} sellOrdersFile CSV of sell orders
 * @param {string} method Relief method
 */
const main = async (holdingsFile: string, sellOrdersFile: string, method: string, allowDecimals = false) => {
  // Read the holdings and sell orders files
  // ./ on node refers to the current working directory, should be the same as process.cwd()
  const holdings = (await read(`./${holdingsFile}`)) as Holding[]
  const sellOrders = (await read(`./${sellOrdersFile}`)) as SellOrder[]

  // Default to FIFO
  let reliefMethod: ReliefMethod = ReliefMethod.FIFO

  // If passed, make sure the method argument is valid
  if (method) {
    if (Object.values(ReliefMethod).some((_method: string) => _method === method.toLowerCase())) {
      reliefMethod = <ReliefMethod>method.toLowerCase()
    } else {
      console.error(`Invalid relief method: ${method}`)
      process.exit(9)
    }
  }

  // Relief methods
  const reliefMethods = {
    [ReliefMethod.FIFO]: new Fifo(),
    [ReliefMethod.LIFO]: new Lifo(),
    [ReliefMethod.HIFO]: new Hifo()
  }

  if (!reliefMethods[reliefMethod]) {
    console.error(`Invalid relief method: ${reliefMethod}`)
    process.exit(9)
  }

  const result = reliefMethods[reliefMethod].relieve(holdings, sellOrders, allowDecimals)

  // Returns output as CSV, but the array output is easier to read in the console
  // real world, we'd want to write to a file
  // console.log(Papa.unparse(result))

  clear() // Clear the console
  console.log(result)
}

// Set up Commander and parse the arguments
program
  .option('-l, --tax_lot_holdings_file <file>', 'A file which contains the users tax lot holdings')
  .option(
    '-s, --sell_list_file <file>',
    "A file which contains the user's desired number of sells as well as the sell price of each security"
  )
  .option('-m, --relief_method <method>', 'Choice between FIFO, LIFO and HIFO; defaults to FIFO')

program.parse()

const {
  tax_lot_holdings_file: taxLotHoldingsFile,
  sell_list_file: sellListFile,
  relief_method: reliefMethod
} = program.opts()

if (!taxLotHoldingsFile || !sellListFile) {
  console.error('ERROR: Missing required arguments')
  process.exit(9)
}

// Kick off the main thread
main(taxLotHoldingsFile, sellListFile, reliefMethod)
