import React from 'react'
import PropTypes from 'prop-types'
import {FiFileText} from 'react-icons/fi'
import {Stack, Label, Code} from '@sanity/ui'

import Message from '../components/Message'
import ArticlePreview from '../components/ArticlePreview'
import DEFAULT_VARIANT from '../lib/defaultVariant'

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
  // fieldsets: [
  //   {
  //     name: 'publishing',
  //     title: 'Publishing',
  //     options: {columns: 2},
  //   },
  // ],
  fields: [
    {name: 'message', type: 'text', inputComponent: Message},
    {
      name: 'variant',
      title: 'Variant',
      type: 'string',
      readOnly: true,
      hidden: true,
      initialValue: DEFAULT_VARIANT,
      // inputComponent: VariantLabel,
      // fieldset: 'publishing',
    },
    {
      name: 'live',
      title: 'Live',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
      hidden: true,
      // fieldset: 'publishing',
      description: `This can only be changed by clicking "Go Live" on a Published, ${DEFAULT_VARIANT} Variant Article.`,
    },
    {name: 'title', type: 'string'},
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
