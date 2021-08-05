import React from 'react'
import ArticleAndVariant from '../../components/ArticleAndVariant'
import ArticlePreview from '../../components/ArticlePreview'
import VariantSelector from '../../components/VariantSelector'
import DEFAULT_VARIANT from '../../lib/defaultVariant'

export default {
  name: 'variantSelector',
  title: 'Variant Selector',
  type: 'object',
  // fieldsets: [
  //   {
  //     name: 'articleAndVariant',
  //     title: 'Article and Variant',
  //     options: {
  //       collapsible: false,
  //       collapsed: false,
  //       // columns: 2
  //     },
  //   },
  // ],
  // inputComponent: ArticleAndVariant,
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
    // {
    //   name: 'variant',
    //   title: 'Variant',
    //   type: 'string',
    //   fieldset: 'articleAndVariant',
    //   options: {
    //     list: ['one', 'two', 'three'],
    //     layout: 'radio',
    //   },
    //   inputComponent: VariantSelector,
    // },
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
