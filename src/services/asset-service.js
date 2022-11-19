import Arweave from 'arweave'
import { map } from 'ramda'

const URL = 'https://gateway.redstone.finance/gateway/contracts/deploy'
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})
/**
 * @typedef {object} Tag
 * @property {string} name
 * @property {string} value
 * 
 * @typedef {object} Transaction
 * @property {ArrayBuffer} data
 * @property {Tag[]} tags
 * 
 * @typedef {object} AssetPage
 * @property {Transaction} asset
 * @property {Transaction} source
 * 
 */

/**
 * @param {AssetPage} asset
 */
export const publish = (asset) => {
  return Promise.resolve(asset)
    .then(asset => Promise.all([
      dispatch(asset.source),
      dispatch(asset.asset)
    ]))
    .then(([_, asset]) => asset)
    .then(post)
}

async function dispatch({ data, tags }) {
  if (!arweaveWallet) {
    return Promise.reject('No wallet found')
  }
  const address = await arweaveWallet.getActiveAddress()
  const tx = await arweave.createTransaction({ data })
  map(t => tx.addTag(t.name, t.value), tags)
  tx.addTag('initState', JSON.stringify({
    balances: {
      [address]: 10000
    },
    name: 'SpecAsset',
    ticker: 'SPEC',
    pairs: [],
    settings: [['isTradeable', true]]
  }))

  const result = await arweaveWallet.dispatch(tx)
  return { data, tags, id: result.id }
}

async function post({ data, tags, id }) {
  if (!fetch) {
    return Promise.reject('fetch is required!')
  }
  const address = await arweaveWallet.getActiveAddress()
  const tx = await arweave.createTransaction({ data })
  map(t => tx.addTag(t.name, t.value), tags)

  tx.addTag('initState', JSON.stringify({
    balances: {
      [address]: 10000
    },
    name: 'SpecAsset',
    ticker: 'SPEC',
    pairs: [],
    settings: [['isTradeable', true]]
  }))

  await arweave.transactions.sign(tx, 'use_wallet')
  tx.id = id
  await fetch(URL, {
    method: 'POST',
    body: JSON.stringify({ contractTx: tx }),
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
  return { id }
}
