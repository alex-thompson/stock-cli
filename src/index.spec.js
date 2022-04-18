let exec = require('child_process').exec

// TODO: Decouple from test files
// TODO: Add more tests around the read/input and making sure we have valid/complete CSV
// TODO: Add test for invalid stock tickers
// TODO: Add tests to make sure we don't try to sell more shares than user has
// TODO: Add tests for selling full/partial shares

const cli = (args) => {
  return new Promise((resolve) => {
    // Just run through npm start so we don't have to worry about path issues
    // exec(`ts-node ${__dirname}/index.ts -- ${args.join(' ')}`, { cwd }, (error, stdout, stderr) => {
    exec(`npm start --silent -- ${args.join(' ')}`, (error, stdout, stderr) => {
      resolve({
        code: error && error.code ? error.code : 0,
        error,
        stdout,
        stderr
      })
    })
  })
}

describe('The CLI', () => {
  it('should return 0 when no error', async () => {
    let result = await cli(['-l', 'holdings.csv', '-s', 'sell-orders.csv'])
    expect(result.code).toBe(0)
  })

  it('should return 9 when required arguments are missing', async () => {
    let result = await cli(['-l', 'holdings.csv'])
    expect(result.code).toBe(9)
  })

  it('should return 9 when an invalid relief method is passed', async () => {
    let result = await cli(['-l', 'holdings.csv', '-s', 'sell-orders.csv', '-m', 'invalid'])
    expect(result.code).toBe(9)
  })

  it('should return 1 when an invalid option is passed', async () => {
    let result = await cli(['-l', 'holdings.csv', '-s', 'sell-orders.csv', '-z', 'invalid'])
    expect(result.code).toBe(1)
  })
})

describe('The output', () => {
  const header = ['Tick', 'Orig Hold', 'Purch Price', 'Purch Date', 'Relvd Hold', 'Amt Relvd']

  it('should sort by FIFO when no relief_method is passed', async () => {
    let result = await cli(['-l', 'holdings.csv', '-s', 'sell-orders.csv'])
    expect(result.code).toBe(0)

    const json = `{ "data": ${result.stdout.replace(/\'/g, '"')} }`
    const stdout = JSON.parse(json).data

    expect(stdout).toEqual(
      expect.arrayContaining([
        header,
        ['bp', 20, 40, '2018-08-01', 0, 20],
        ['bp', 30, 42.5, '2018-09-01', 15, 15],
        ['f', 10, 9.5, '2018-09-05', 5, 5]
      ])
    )
  })

  it('should sort by FIFO when -m fifo is passed', async () => {
    let result = await cli(['-l', 'holdings.csv', '-s', 'sell-orders.csv', '-m', 'fifo'])
    expect(result.code).toBe(0)

    const json = `{ "data": ${result.stdout.replace(/\'/g, '"')} }`
    const stdout = JSON.parse(json).data

    expect(stdout).toEqual(
      expect.arrayContaining([
        header,
        ['bp', 20, 40, '2018-08-01', 0, 20],
        ['bp', 30, 42.5, '2018-09-01', 15, 15],
        ['f', 10, 9.5, '2018-09-05', 5, 5]
      ])
    )
  })

  it('should sort by LIFO when -m lifo is passed', async () => {
    let result = await cli(['-l', 'holdings.csv', '-s', 'sell-orders.csv', '-m', 'lifo'])
    expect(result.code).toBe(0)

    const json = `{ "data": ${result.stdout.replace(/\'/g, '"')} }`
    const stdout = JSON.parse(json).data

    expect(stdout).toEqual(
      expect.arrayContaining([
        header,
        ['bp', 30, 42.5, '2018-09-01', 0, 30],
        ['bp', 20, 40, '2018-08-01', 15, 5],
        ['f', 10, 9.5, '2018-09-05', 5, 5]
      ])
    )
  })

  it('should sort by HIFO when -m hifo is passed', async () => {
    let result = await cli(['-l', 'holdings.csv', '-s', 'sell-orders.csv', '-m', 'hifo'])
    expect(result.code).toBe(0)

    const json = `{ "data": ${result.stdout.replace(/\'/g, '"')} }`
    const stdout = JSON.parse(json).data

    expect(stdout).toEqual(
      expect.arrayContaining([
        header,
        ['bp', 30, 42.5, '2018-09-01', 0, 30],
        ['bp', 20, 40, '2018-08-01', 15, 5],
        ['f', 10, 9.5, '2018-09-05', 5, 5]
      ])
    )
  })
})
