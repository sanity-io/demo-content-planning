import {FiFlag} from 'react-icons/fi'

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
      placeholder: '',
      description:
        'Setup a future Release date. If left blank, Articles will be Released immediately.',
    },
    {
      name: 'articles',
      title: 'Articles',
      type: 'array',
      description: `When Released each Article will be merged into "${DEFAULT_VARIANT}" and set Live. Articles which are already Live cannot be added here.`,
      // Had an idea for a two-step selector but it's more work than its worth
      // Also, a weak ref might not be a good idea anyway...
      of: [{type: 'variantSelector'}],
    },
    {
      name: 'log',
      title: 'Log',
      description: 'The Release function updates this field.',
      type: 'text',
      readOnly: true,
    },
  ],
}
