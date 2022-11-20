const GRAPHQL = 'https://arweave.net/graphql'

export const gql = (query) => fetch(GRAPHQL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query })
}).then(res => res.ok ? res.json() : Promise.reject('Could not query graphql server'))