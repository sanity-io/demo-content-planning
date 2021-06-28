import React from 'react'
import {FiFlag} from 'react-icons/fi'

import ArticlePreview from '../components/ArticlePreview'
import DEFAULT_VARIANT from '../lib/defaultVariant'

export default {
  name: 'release',
  title: 'Release',
  type: 'document',
  icon: FiFlag,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Give this Release a name, for reference.',
    },
    {
      name: 'schedule',
      title: 'Schedule Release',
      type: 'datetime',
      description:
        'Setup a future release date. If left blank, Articles will be released immediately.',
    },
    {
      name: 'articles',
      title: 'Articles',
      type: 'array',
      description: `Choose from this list of "${DEFAULT_VARIANT}" Variant Articles that are not yet "Live". Publishing this Release will set them "Live" and make them publicly querable outside the Studio.`,
      of: [
        {
          name: 'article',
          title: 'Article',
          type: 'object',
          fields: [
            {
              name: 'article',
              title: 'Article',
              type: 'reference',
              to: [{type: 'article'}],
              options: {
                filter: `variant == "${DEFAULT_VARIANT}"`,
              },
            },
            {
              name: 'variant',
              title: 'Variant',
              type: 'string',
              options: {
                list: [
                  {title: 'Main', value: 'main'},
                  {title: 'July', value: 'july'},
                  {title: 'October', value: 'october'},
                ],
              },
            },
          ],
          preview: {
            select: {
              _id: 'article._id',
              title: 'article.title',
              live: 'article.live',
              variant: 'variant',
            },
            prepare: ({_id, title, live, variant}) => {
              return {
                title,
                subtitle: `
                  ${
                    variant === DEFAULT_VARIANT
                      ? `Release "${DEFAULT_VARIANT}" Variant`
                      : `Merge "${variant}" into "${DEFAULT_VARIANT}"`
                  } 
                  ${live ? `(Already Live)` : `and Go Live`}
                `,
                media: <ArticlePreview _id={_id} live={live} />,
              }
            },
          },
        },
      ],
    },
  ],
}
