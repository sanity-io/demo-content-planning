import {FiFlag} from 'react-icons/fi'

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
      hidden: true,
    },
    {
      name: 'articles',
      title: 'Articles',
      type: 'array',
      description:
        'Choose from this list of "main" branch Articles that are not yet "Live". Publishing this Release will set them "Live" and make them publicly querable outside the Studio.',
      of: [
        {
          name: 'article',
          title: 'Article',
          type: 'reference',
          to: [{type: 'article'}],
          options: {
            filter: 'branch == "main" && !live',
          },
        },
      ],
    },
  ],
}
