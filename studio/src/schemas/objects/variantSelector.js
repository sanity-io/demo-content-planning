import React from 'react'
import ArticlePreview from '../../components/ArticlePreview'
import DEFAULT_VARIANT from '../../lib/defaultVariant'

export default {
  name: 'variantSelector',
  title: 'Variant Selector',
  type: 'object',
  fields: [
    {
      name: 'article',
      title: 'Article',
      type: 'reference',
      to: [{type: 'article'}],
      validation: (Rule) => Rule.required(),
      // fieldset: 'articleAndVariant',
      options: {
        filter: `!live`,
      },
    },
  ],
  preview: {
    select: {
      _id: 'article._id',
      title: 'article.title',
      live: 'article.live',
      variant: 'article.variant',
    },
    prepare: ({_id, title, live, variant}) => {
      if (!variant) {
        return {
          title: 'Missing Reference',
          subtitle: 'Select an Article',
        }
      }

      return {
        title,
        subtitle: `
          ${
            variant === DEFAULT_VARIANT
              ? `Release "${DEFAULT_VARIANT}" Variant`
              : `Merge "${variant}" Variant into "${DEFAULT_VARIANT}"`
          }
          ${live ? `(Already Live)` : `and Go Live`}
        `,
        media: <ArticlePreview _id={_id} live={live} />,
      }
    },
  },
}
