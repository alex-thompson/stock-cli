import fs from 'fs'
import Papa from 'papaparse'

export const read = async (file: string, header = false): Promise<unknown[]> => {
  return new Promise((resolve, reject) => {
    const readable = fs.createReadStream(file)
    const chunks: any = []

    readable.on('readable', () => {
      let chunk
      while (null !== (chunk = readable.read())) {
        chunks.push(chunk)
      }
    })

    readable.on('end', () => {
      const parsed = Papa.parse(chunks.toString(), {
        dynamicTyping: true,
        header
      })
      resolve(parsed.data)
    })

    // TODO: Handle/log errors
  })
}
