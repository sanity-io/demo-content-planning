/* eslint-disable no-console */
import sanityClient from 'part:@sanity/base/client'
import {randomKey} from '@sanity/util/content'
import {uuid} from '@sanity/uuid'

import faker from 'faker'
import DEFAULT_VARIANT from '../src/lib/defaultVariant'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

function createArticle(_id = ``, variant = ``, live = false) {
  const title = [
    faker.commerce.productAdjective(),
    faker.commerce.productMaterial(),
    faker.commerce.product(),
  ].join(' ')

  const content = [
    faker.commerce.productDescription(),
    faker.commerce.productDescription(),
    faker.commerce.productDescription(),
  ].join('\n\n')

  return {
    _id,
    _type: `article`,
    variant,
    title,
    slug: {current: faker.helpers.slugify(title).toLowerCase()},
    content,
    live,
  }
}

function createRandomRelease(arr) {
  return {
    _key: randomKey(12),
    _type: 'variantSelector',
    article: {
      _type: 'reference',
      _ref: arr[Math.floor(Math.random() * arr.length)]._id,
    },
  }
}

function monthNext(offset = 1) {
  const date = new Date()
  return new Date(date.setMonth(date.getMonth() + offset))
}

function monthNextTitle(input) {
  return new Intl.DateTimeFormat('en-US', {month: 'long'}).format(input)
}

async function generateArticles() {
  const count = 10

  const mainArticles = []

  // Create main articles
  for (let index = 0; index < count; index++) {
    mainArticles[index] = createArticle(uuid(), DEFAULT_VARIANT, index > count - 2)
  }

  // Create variants
  const variantArticles = mainArticles.map((article) => {
    // But with the variant-ified _id
    const newId = `${article._id}.${randomKey(12)}`

    // With all new content and variant name
    const newVariant = faker.random.word().toLowerCase()

    return createArticle(newId, newVariant)
  })

  // Create releases
  const allReleases = [
    {
      _type: 'release',
      title: `Ready to Release Now`,
      articles: [createRandomRelease(variantArticles), createRandomRelease(variantArticles)],
    },
    {
      _type: 'release',
      title: `${monthNextTitle(monthNext())} Articles`,
      schedule: monthNext(),
      articles: [
        createRandomRelease(variantArticles),
        createRandomRelease(variantArticles),
        createRandomRelease(variantArticles),
      ],
    },
    {
      _type: 'release',
      title: `${monthNextTitle(monthNext(2))} Specials`,
      schedule: monthNext(2),
      articles: [
        createRandomRelease(variantArticles),
        createRandomRelease(variantArticles),
        createRandomRelease(variantArticles),
      ],
    },
  ]

  // Combine!
  const allArticles = [...mainArticles, ...variantArticles, ...allReleases]

  // Remove all existing articles
  await client.delete({query: `*[_type in ["article", "release"]]`})

  // Begin!
  const transaction = client.transaction()

  // Enqueue new articles
  allArticles.forEach((article) => transaction.create(article))

  // Let's go!
  transaction
    .commit()
    .then((transactionRes) => console.log(transactionRes))
    .catch((transactionErr) => console.error(transactionErr))
}

generateArticles()
