import { assert, test } from 'vitest'
import { publish } from './asset-service'
import crypto from 'crypto'
import Arweave from 'arweave'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

const ID = crypto.randomUUID()
const SRC = 'x0ojRwrcHBmZP20Y4SY0mgusMRx-IYTjg5W8c3UFoNs'

const asset = {
  asset: {
    data: '<h1>Hello World</h1>',
    tags: [
      { name: 'Content-Type', value: 'text/html' },
      { name: 'App-Name', value: 'SmartWeaveContract' },
      { name: 'App-Version', value: '0.3.0' },
      { name: 'Contract-Src', value: SRC },
      { name: 'Init-State', value: JSON.stringify(initState) },
      { name: 'Title', value: 'Hello World' },
      { name: 'Description', value: 'Test' },
      { name: 'Type', value: 'test' },
      { name: 'Asset-Id', value: ID }
    ]
  },
  source: {
    data: '# Hello World',
    tags: [
      { name: 'Content-Type', value: 'text/markdown' },
      { name: 'App-Name', value: 'PostSource' },
      { name: 'Title', value: 'Hello World' },
      { name: 'Description', value: 'Test' },
      { name: 'Type', value: 'post-source' },
      { name: 'Asset-Id', value: ID }
    ]
  }
}

globalThis.arweaveWallet = {
  dispatch: async (tx) => {
    await arweave.transactions.sign(tx, 'use_wallet')
    return Promise.resolve({ data: { id: tx.id } })
  }
}

test('Publish Atomic Asset', async () => {
  const result = await publish(asset)
  assert.ok(true)
})