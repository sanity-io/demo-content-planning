import {isFuture} from 'date-fns'
import sanityClient from '@sanity/client'
import {Repeater} from 'repeaterdev-js'

import DEFAULT_VARIANT from '../../../studio/src/lib/defaultVariant'

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2021-07-05',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const repeater = new Repeater(process.env.REPEATER_TOKEN)

export default async function release(req, res) {
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

  const {_id, title, schedule, log} =
    typeof req?.body === 'string' ? JSON.parse(req.body) : req?.body

  if (!_id) {
    res.status(200).json({message: `No _id provided`})
    return
  }

  // 1. Check for future Schedule date
  // If found, setup a repeater.dev job to perform this release later
  if (schedule && isFuture(new Date(schedule))) {
    const endpoint = [
      process.env.NODE_ENV === 'development' ? `http://` : `https://`,
      req.headers.host,
      req.url,
    ].join('')

    await repeater.enqueueOrUpdate({
      name: _id,
      endpoint,
      verb: 'post',
      runAt: new Date(schedule),
      headers: {'Content-Type': 'application/json'},
      json: {_id},
    })

    const newLog = [
      `[${new Date().toString()}]:`,
      `${title ?? _id}`,
      `Scheduled for ${schedule}`,
    ].join('\n')

    await client
      .patch(_id)
      .set({log: log ? log + newLog : newLog})
      .commit()
      .then((clientResponse) => {
        // console.log(clientResponse, log)
      })
      .catch((err) => {
        console.error('Oh no, the update failed: ', err.message)
      })

    res.status(200).json({message: `Scheduled for ${schedule}`})

    return
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
      const lines = [
        `[${new Date().toString()}]:`,
        mainId,
        article.title,
        `Merged Variant "${article.variant}" into "${DEFAULT_VARIANT}"`,
      ]
      logItems.push(lines.join('\n'))

      transaction.createOrReplace({
        ...article,
        _id: mainId,
        variant: `main`,
        live: true,
      })
    })

    const newLog = logItems.join('\n\n')

    transaction.patch(_id, (p) => p.set({log: log ? `${newLog}\n\n${log}` : newLog}))

    await transaction
      .commit()
      .then((transactionResponse) => {
        // console.log(`Transaction Complete `, transactionResponse)
        results = res?.results
      })
      .catch((err) => console.error(`Transaction Errors `, err))
  }

  // console.log(query, params)

  res.status(200).json({message: `All done!`, results})
}
