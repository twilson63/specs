/**
 * store can wire the services to the core business logic and
 * make it available for any view
 * 
 */
import { readable, writable } from 'svelte/store'
import { post, list } from './domain/index.js'
import { publish } from './services/asset-service.js'
import { gql } from './services/arweave.js'


export const profile = writable(null)
export const app = readable({
  post: (asset) => post(asset).runWith({ publish }).toPromise(),
  list: () => list().runWith({ gql }).toPromise()
})