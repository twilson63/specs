import { Async, ReaderT } from 'crocks'
import { z } from 'zod'
import { h } from 'hastscript'
import { toHtml } from 'hast-util-to-html'


const { of, ask, lift } = ReaderT(Async)

const Spec = z.object({
  title: z.string(),
  abstract: z.string(),
  version: z.string(),
  authors: z.array(z.object({
    name: z.string(),
    address: z.string(),
    email: z.string()
  })),
  html: z.string(),
  content: z.string()
})

const validate = data => Async.fromPromise(Spec.parseAsync.bind(Spec))(data)
const generate = spec => ({
  ...spec, html: toHtml(
    h('html', [
      h('head', [
        h('title', spec.title),
        h('meta', { name: 'description', content: spec.abstract })
      ]),
      h('body', marked(spec.content))
    ])
  )
})

/**
 * - post
 * - get
 * - put
 * - remove
 * - list
 */

export const post = spec => of(spec)
  .chain(spec => ask(env => validate(spec)
    .map(generate)
    .chain(env.publish)
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