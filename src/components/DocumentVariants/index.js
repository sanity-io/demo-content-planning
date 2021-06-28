import React from 'react'
import PropTypes from 'prop-types'
import {IntentLink} from 'part:@sanity/base/router'
import {Box, Text} from '@sanity/ui'

import DEFAULT_VARIANT from '../../lib/defaultVariant'
import styles from './index.module.css'
import Preview from './Preview'
import {useDocuments} from './hooks'

function DocumentVariants({document: sanityDocument}) {
  const {published} = sanityDocument
  const mainId =
    published?.branch === DEFAULT_VARIANT ? published?._id : published?._id.split('.').shift()

  const query = `*[_id in path("${mainId}.*") && variant != "${DEFAULT_VARIANT}"]`
  const documents = useDocuments(mainId, query)

  return (
    <div>
      {documents?.length > 0 ? (
        documents.map((doc) => (
          <IntentLink
            key={doc._id}
            className={styles.item}
            intent="edit"
            params={{id: doc._id, type: doc._type}}
          >
            <Preview id={doc._id} />
          </IntentLink>
        ))
      ) : (
        <Box padding={3}>
          <Text>This document has no Variants</Text>
        </Box>
      )}
    </div>
  )
}

DocumentVariants.propTypes = {
  document: PropTypes.shape({
    published: PropTypes.shape({
      _id: PropTypes.string,
    }),
  }).isRequired,
}

export default DocumentVariants
