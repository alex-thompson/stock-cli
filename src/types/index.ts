// Shared types
// Can be expanded with subfolders for more organization in the future

export enum ReliefMethod {
  FIFO = 'fifo',
  LIFO = 'lifo',
  HIFO = 'hifo'
}

// export type StockHolding = {
//   ticker: string
//   shares: number
//   price: number
//   // purchaseDate: Date // TODO: Should this be string | Date?
//   purchaseDate: string
// }

export type StockHolding = [ticket: string, shares: number, price: number, purchaseDate: string]

// export type SellOrder = {
//   ticker: string
//   shares: number
// }

export type SellOrder = [ticket: string, shares: number]

// export interface Lot {
//   // ticker: string
//   shares: number
//   price: number
//   purhcaseDate: string
// }

// export type Lot = [shares: number, price: number, purchaseDate: string]

// export interface ReliefResult {
//   isComplete: boolean
//   lots: Lot[]
// }

// export interface Method {
//   // sell(holdings: StockHolding[], sellList: SellOrder[]): ReliefResult
//   sort(holdings: StockHolding[]): void
//   relieve(holdings: StockHolding[], sellOrders: SellOrder[]): void
// }
