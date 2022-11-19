import { Async, ReaderT } from 'crocks'
import { z } from 'zod'
import { h } from 'hastscript'
import { toHtml } from 'hast-util-to-html'
import { identity, over, lensProp, lens, prop, assoc, compose, trim, split, map } from 'ramda'
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
  //.map(x => (console.log('spec', x), x))
  .map(over(lensHtml, generate))
  .map(over(lensProp('topics'), compose(map(trim), split(','))))
  //.map(x => (console.log('spec', x), x))
  .chain(spec => ask(env => validate(spec)
    .map(transformSpec)
    .chain(Async.fromPromise(env.publish))
  ))
  .chain(lift)

export const get = id => of(id)
  .chain(id => ask(env =>
    env.readState(id)
      .chain(validate)
  ))
  .chain(lift)

export const put = (id, spec) => of({ id, ...spec })
  .chain(s => ask(env => validate(s)
    .chain(env.publish)
  ))
  .chain(lift)


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