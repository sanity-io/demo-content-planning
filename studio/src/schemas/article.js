import React from 'react'
import PropTypes from 'prop-types'
import {FiFileText} from 'react-icons/fi'
import sanityClient from 'part:@sanity/base/client'
import {Stack, Label, Code} from '@sanity/ui'

import Message from '../components/Message'
import ArticlePreview from '../components/ArticlePreview'
import DEFAULT_VARIANT from '../lib/defaultVariant'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export function isUniqueToDefaultDocuments(slug, options) {
  const {document} = options

  const id = document._id.replace(/^drafts\./, '')
  const params = {
    type: document._type,
    draft: `drafts.${id}`,
    published: id,
    slug,
  }

  const query = `!defined(*[
    !(_id in [$draft, $published]) && 
    _type == $type && 
    variant != ^.variant && 
    slug.current == $slug
  ][0]._id)`

  return client.fetch(query, params)
}

function VariantLabel({value}) {
  return (
    <Stack space={2}>
      <Label size={1}>Variant</Label>
      <Code>{value}</Code>
    </Stack>
  )
}

VariantLabel.propTypes = {
  value: PropTypes.string.isRequired,
}

export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: FiFileText,
  validation: (Rule) =>
    Rule.custom((fields) => {
      // This should be an impossible state for the Document to reach
      if (fields.variant !== DEFAULT_VARIANT && fields.live === true) {
        return `Only the "${DEFAULT_VARIANT}" Document can be Live`
      }

      return true
    }),
  fields: [
    {name: 'message', type: 'text', inputComponent: Message},
    {
      name: 'variant',
      title: 'Variant',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
      initialValue: DEFAULT_VARIANT,
      hidden: true,
      // inputComponent: VariantLabel,
    },
    {
      name: 'live',
      title: 'Live',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
      description: `This can only be changed by clicking "Make Live" on a Published, ${DEFAULT_VARIANT} Variant Article.`,
      hidden: true,
    },
    {name: 'title', type: 'string'},
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', isUnique: isUniqueToDefaultDocuments},
      validation: (Rule) => Rule.required(),
    },
    {name: 'content', type: 'text'},
  ],
  preview: {
    select: {
      _id: '_id',
      title: 'title',
      variant: 'variant',
      live: 'live',
    },
    prepare: ({_id, title, variant, live}) => ({
      title,
      subtitle: `${variant} ${live ? ` | Live` : ``}`,
      media: <ArticlePreview _id={_id} live={live} />,
    }),
  },
}
