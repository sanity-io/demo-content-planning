import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

import article from './article'
import release from './release'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([article, release]),
})
