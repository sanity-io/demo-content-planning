import React from 'react'
import PropTypes from 'prop-types'
import {IntentLink} from 'part:@sanity/base/router'
import {Box, Text} from '@sanity/ui'

import styles from './index.module.css'
import Preview from './Preview'
import {useDocuments} from './hooks'

function DocumentBranches({document: sanityDocument}) {
  const {published} = sanityDocument
  const mainId = published?.branch === 'main' ? published?._id : published?._id.split('.').shift()

  const query = `*[_id in path("${mainId}.*") && branch != "main"]`
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
          <Text>This document has no branches</Text>
        </Box>
      )}
    </div>
  )
}

DocumentBranches.propTypes = {
  document: PropTypes.shape({
    published: PropTypes.shape({
      _id: PropTypes.string,
    }),
  }).isRequired,
}

export default DocumentBranches
