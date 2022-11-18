/**
 * store can wire the services to the core business logic and
 * make it available for any view
 * 
 */
import { readable, writable } from 'svelte/store'
import { post } from './core.js'
import { publish } from './services/asset-service.js'

export const profile = writable(null)
export const app = readable({
  post: (asset) => post(asset).runWith({ publish }).toPromise()
})