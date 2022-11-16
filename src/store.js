/**
 * store can wire the services to the core business logic and
 * make it available for any view
 * 
 */
import { writable } from 'svelte/store'

export const profile = writable(null)