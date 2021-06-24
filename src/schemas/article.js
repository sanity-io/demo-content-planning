import React from 'react'
import PropTypes from 'prop-types'
import {FiFileText} from 'react-icons/fi'
import {Stack, Label, Code} from '@sanity/ui'

import Message from '../components/Message'
import ArticlePreview from '../components/ArticlePreview'

function BranchLabel({value}) {
  return (
    <Stack space={2}>
      <Label size={1}>Branch</Label>
      <Code>{value}</Code>
    </Stack>
  )
}

BranchLabel.propTypes = {
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
      name: 'branch',
      title: 'Branch',
      type: 'string',
      readOnly: true,
      hidden: true,
      initialValue: 'main',
      // inputComponent: BranchLabel,
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
      description:
        'This can only be changed by clicking "Go Live" on a Published, main Branch Article.',
    },
    {name: 'title', type: 'string'},
    {name: 'content', type: 'text'},
  ],
  preview: {
    select: {
      _id: '_id',
      title: 'title',
      branch: 'branch',
      live: 'live',
    },
    prepare: ({_id, title, branch, live}) => ({
      title,
      subtitle: `${branch} ${live ? ` | Live` : ``}`,
      media: <ArticlePreview _id={_id} live={live} />,
    }),
  },
}
