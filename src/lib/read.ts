import fs from 'fs'
import Papa from 'papaparse'

// TODO: There'd need to be more guards and robust error handling here
// since the files are our entry point for user input. PapaParse is great,
// but I'd want to put it through its paces with a lot of different test cases
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
