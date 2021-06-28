import PropTypes from 'prop-types'
import React from 'react'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import {useDocuments} from './hooks'

export default function DocPreview({id}) {
  const query = `*[_id == "${id}"]`
  const docs = useDocuments(id, query)
  const doc = docs && docs[0]
  return <div>{doc ? <Preview value={doc} type={schema.get(doc._type)} /> : 'Loading...'}</div>
}

DocPreview.propTypes = {
  id: PropTypes.string.isRequired,
}
