import fetch from 'node-fetch'
import Arweave from 'arweave'
import { Async } from 'crocks'
import { map } from 'ramda'

const { of, fromPromise } = Async
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
export const publish = (asset) =>
  of({ asset })
    .chain(dispatchSource)
//.chain(dispatchAsset)
//.chain(postAsset)


function dispatchSource(ctx) {
  if (!arweaveWallet) {
    return Async.Rejected('No wallet found')
  }
  return fromPromise(async (ctx) => {
    const tx = await arweave.createTransaction({ data: ctx.asset.source.data })
    map(t => tx.addTag(t.name, t.value), ctx.asset.source.tags)
    return arweaveWallet.dispatch(tx)
  })(ctx)
    .map(result => {
      console.log(result)
    })
    .map(_ => ctx)
}