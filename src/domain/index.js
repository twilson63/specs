import { Async, ReaderT } from 'crocks'
import { z } from 'zod'
import { h } from 'hastscript'
import { toHtml } from 'hast-util-to-html'
import {
  __,
  not, find, identity, over, lensProp, lens, pluck,
  path, assoc, compose, trim, split, map, filter,
  prop, propEq, head
} from 'ramda'
import { marked } from 'marked'


const SRC = 'x0ojRwrcHBmZP20Y4SY0mgusMRx-IYTjg5W8c3UFoNs'

const { of, ask, lift } = ReaderT(Async)

const Spec = z.object({
  assetId: z.string(),
  title: z.string(),
  description: z.string(),
  html: z.string(),
  content: z.string(),
  topics: z.array(z.string())
})

const lensHtml = lens(identity, assoc('html'))
const validate = data => Async.fromPromise(Spec.parseAsync.bind(Spec))(data)
const generate = spec => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${spec.title}</title>
    <meta name="description" content="${spec.description}">
  </head>
  <body>
    ${marked.parse(spec.content)}
  </body>
</html>
`

/**
 * toHtml(
  h('html', [
    h('head', [
      h('title', spec.title),
      h('meta', { name: 'description', content: spec.abstract })
    ]),
    h('body', marked.parse(spec.content))
  ])
)
 */

/**
 * - post
 * - get
 * - put
 * - remove
 * - list
 */

export const post = spec => of(spec)
  .map(over(lensProp('assetId'), crypto.randomUUID.bind(crypto)))
  .map(over(lensHtml, generate))
  .map(over(lensProp('topics'), compose(map(trim), split(','))))
  .chain(spec => ask(env =>
    validate(spec)
      .map(transformSpec)
      .chain(Async.fromPromise(env.publish))
  ))
  .chain(lift)

export const list = () => of(specQuery())
  .chain(query => ask(env =>
    Async.fromPromise(env.gql)(query)
      .map(compose(
        map(toSpec),
        filter(noBundleFilter),
        pluck('node'),
        path(['data', 'transactions', 'edges'])
      ))
  ))
  .chain(lift)

export const hx = () => {

}

export const get = id => of(id)
  .chain(id => ask(env =>
    Async.fromPromise(env.gql)(specSourceByAssetId(id))
      .map(compose(
        head,
        map(toSpec),
        pluck('node'),
        path(['data', 'transactions', 'edges'])
      ))
      .chain(spec =>
        Async.fromPromise(fetch)(`https://arweave.net/${spec.sourceId}`)
          .chain(res => Async.fromPromise(res.text.bind(res))())
          .map(assoc('content', __, spec))
      )
      .map(over(lensHtml, generate))
      .chain(validate)
  ))
  .chain(lift)

export const put = (id, spec) => of({ id, ...spec })
  .chain(s => ask(env => validate(s)
    .chain(env.publish)
  ))
  .chain(lift)

function specSourceByAssetId(id) {
  return `query {
    transactions( 
      tags: [
        {name:"Content-Type", values:["text/markdown"]},
        {name:"Type", values:["spec-source"]},
        {name: "Asset-Id", values: ["${id}"]}
      ]
    ) {
      edges {
        node {
          id
          tags {
            name 
            value 
          }
        }
      }
    }
  }`
}

function specQuery() {
  return `query {
transactions(first: 100, tags: {name: "Type", values:["spec"]}) {
  edges {
    node {
      id
      tags {
        name
        value
      }
    }
  }
}
  }`
}

function transformSpec(spec) {
  return {
    source: {
      data: spec.content,
      tags: [
        { name: 'Content-Type', value: 'text/markdown' },
        { name: 'App-Name', value: 'Specs' },
        { name: 'Title', value: spec.title },
        { name: 'Description', value: spec.description },
        { name: 'Type', value: 'spec-source' },
        { name: 'Asset-Id', value: spec.assetId }
      ]
    },
    asset: {
      data: spec.html,
      tags: [
        { name: 'Content-Type', value: 'text/html' },
        { name: 'App-Name', value: 'SmartWeaveContract' },
        { name: 'App-Version', value: '0.3.0' },
        { name: 'Contract-Src', value: SRC },
        { name: 'Title', value: spec.title },
        { name: 'Description', value: spec.description },
        { name: 'Type', value: 'spec' },
        { name: 'Asset-Id', value: spec.assetId }
      ]
    }
  }
}

function noBundleFilter({ tags }) {
  return not(find(t => t.name === 'Uploader', tags))
}

function toSpec(n) {
  const getTag = name => compose(prop('value'), find(propEq('name', name)))(n.tags)
  return {
    title: getTag('Title'),
    description: getTag('Description'),
    topics: [],
    assetId: getTag('Asset-Id'),
    sourceId: n.id,
    stamps: 0,
    published: '1/1/1980'
  }
}