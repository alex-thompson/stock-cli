# stock-cli

A command-line program that takes a user's tax lot holdings and relieves them.

Supports the following relief methods:

* FIFO - relieve securities in order of purchase date: first purchased (oldest) is relieved first.
* LIFO - relieve securities in order of purchase date: last purchased (newest) is relieved first.
* HIFO - relieve securities in order of purchase price: highest price is relieved first.

## Usage

To run locally while developing, you can `npm run start -- [options]` with the following options:

```
Usage: stock-cli [options]

Options:
  -l, --tax_lot_holdings_file <file>  A file which contains the user's tax lot holdings
  -s, --sell_list_file <file>         A file which contains the user's desired number of sells as well as the sell price of each security
  -m, --relief_method <method>        Choice between FIFO, LIFO and HIFO; defaults to FIFO
  -h, --help                          display help for command
```

Alternatively, to install the CLI as an npm global package, you can `npm run install-local` and then use `stock-cli [options]`.

## Demo

There are two sample CSV files located at the project root: `holdings.csv` and `sell-orders.csv`. You can quickly test the CLI with the following command: `npm start -- -l holdings.csv -s sell-orders.csv`. Please note that if using the `stock-cli` global, the file path should be relative to your terminal's current working directory.

## Third-Party Libraries
This CLI is powered by [Commander.js](https://github.com/tj/commander.js) and uses [Papa Parse](https://www.papaparse.com/) to help with CSV manipulation, along with [Jest](https://jestjs.io/) for testing.
