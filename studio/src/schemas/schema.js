import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
// import {richDate} from 'part:@sanity/form-builder/input/rich-date/schema'

import article from './article'
import release from './release'
import variantSelector from './objects/variantSelector'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    // Documents
    article,
    release,

    // Types
    // richDate,

    // Objects
    variantSelector,
  ]),
})
