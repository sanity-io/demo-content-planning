import sanityClient from 'part:@sanity/base/client'
import DEFAULT_VARIANT from './defaultVariant'

const previewSecret = `p2avlffp4eg3urdg9s2wxotyoln97bq5azb6`
const remoteUrl = `https://demo-content-planning.sanity.build`
const localUrl = `http://localhost:3000`

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export default async function resolveProductionUrl(doc, returnProd = false) {
  const baseUrl = window.location.hostname === 'localhost' && !returnProd ? localUrl : remoteUrl
  const previewUrl = new URL(`${baseUrl}/api/preview`)
  previewUrl.searchParams.append(`secret`, previewSecret)

  // Need to find the main document slug
  if (doc.variant === DEFAULT_VARIANT) {
    previewUrl.searchParams.append(`slug`, doc?.slug?.current ?? `/`)
  } else {
    const mainId = doc?._id.split('.').shift()
    const mainSlug = await client.fetch(`*[_id == $mainId][0].slug.current`, {mainId})
    previewUrl.searchParams.append(`slug`, mainSlug)
  }

  return previewUrl.toString()
}
