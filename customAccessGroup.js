import sanityClient from 'part:@sanity/base/client'

const client = sanityClient.withConfig({
  apiVersion: `2021-05-19`,
  // Must be a "Create Session" Token
  token: process.env.SANITY_API_TOKEN,
})

const group = {
  _id: '_.groups.public-live',
  _type: 'system.group',
  grants: [
    {
      filter: '_id in path("*") && _type == "article" && live',
      permissions: ['read'],
    },
    {
      filter: '_id in path("*") && _type != "article"',
      permissions: ['read'],
    },
  ],
  members: ['everyone'],
}

client
  .createOrReplace(group)
  .then((res) => console.log(res))
  .catch((err) => console.error(err))
