// Shared types
// Can be expanded with subfolders for more organization in the future

export type Holding = [ticket: string, shares: number, price: number, purchaseDate: string]

export type SellOrder = [ticket: string, shares: number]
