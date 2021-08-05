import {isFuture} from 'date-fns'
import sanityClient from '@sanity/client'
import {Repeater} from 'repeaterdev-js'

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2021-07-05',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const repeater = new Repeater(process.env.REPEATER_TOKEN)

export default async (req, res) => {
  const corsOrigin =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:3333`
      : `https://${process.env.VERCEL_URL}`
  res.setHeader('Access-Control-Allow-Origin', corsOrigin)
  // res.setHeader('Access-Control-Allow-Credentials', true)

  if (req.method !== 'POST') {
    res.status(400).send({message: 'Only POST requests allowed'})
    return
  }

  const {_id, title, schedule} = typeof req?.body === 'string' ? JSON.parse(req.body) : req?.body

  if (!_id) {
    return res.status(200).json({message: `No _id provided`})
  }

  // 1. Check for future Schedule date
  // If found, setup a repeater.dev job to perform this release later
  if (schedule && isFuture(new Date(schedule))) {
    const endpoint = [
      process.env.NODE_ENV === 'development' ? `http://` : `https://`,
      req.headers.host,
      req.url,
    ].join('')

    console.log({endpoint})

    await repeater.enqueueOrUpdate({
      name: _id,
      endpoint,
      verb: 'post',
      runAt: new Date(schedule),
      headers: {'Content-Type': 'application/json'},
      json: {_id},
    })

    const log = `[${new Date().toString()}]:\n${title ?? _id}\nScheduled for ${schedule}`

    await client
      .patch(_id)
      .set({log})
      .commit()
      .then((release) => {
        console.log(release, log)
      })
      .catch((err) => {
        console.error('Oh no, the update failed: ', err.message)
      })

    return res.status(200).json({message: `Scheduled for ${schedule}`})
  }

  // 2. Otherwise, get all the articles attached to this release
  // Merge them into their 'main' Variant and Go Live
  const query = `*[_id == $_id][0]{ articles[]{ article-> } }`
  const params = {_id}
  const data = await client.fetch(query, params)
  const articles = data ? data.articles : []
  let results = []
  const logItems = []

  if (articles?.length) {
    const transaction = client.transaction()

    articles.forEach(({article}) => {
      const mainId = article._id.split('.')[0]
      logItems.push(
        `[${new Date().toString()}]:\n${mainId}\nMerged "${article.variant}" into "main"`
      )

      transaction.createOrReplace({
        ...article,
        _id: mainId,
        variant: `main`,
        live: true,
      })
    })

    transaction.patch(_id, (p) => p.set({log: logItems.join('\n\n')}))

    await transaction
      .commit()
      .then((res) => {
        console.log(`Transaction Complete `, res)
        results = res?.results
      })
      .catch((err) => console.error(`Transaction Errors `, err))
  }

  console.log(query, params)

  return res.status(200).json({message: `All done!`, results})
}
