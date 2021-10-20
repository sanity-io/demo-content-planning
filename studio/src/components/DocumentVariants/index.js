import React from 'react'
import PropTypes from 'prop-types'
import {Box, Flex, Spinner, Stack} from '@sanity/ui'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'

import DEFAULT_VARIANT from '../../lib/defaultVariant'
import EditLink from '../EditLink'
import Feedback from '../Feedback'
import {useDocuments} from './hooks'

function DocumentVariants({document: sanityDocument}) {
  const {published} = sanityDocument
  const mainId =
    published?.variant === DEFAULT_VARIANT ? published?._id : published?._id.split('.').shift()

  const query = `*[_id in path("${mainId}.*") && variant != "${DEFAULT_VARIANT}"]`
  const {isLoading, documents} = useDocuments(mainId, query)

  if (!published) {
    return <Feedback>Document must be Published first before having Variants</Feedback>
  }

  if (isLoading) {
    return (
      <Box padding={4}>
        <Flex align="center" justify="center">
          <Spinner />
        </Flex>
      </Box>
    )
  }

  return (
    <Box padding={2}>
      <Stack space={1}>
        {documents?.length > 0 ? (
          documents.map((doc) => (
            <EditLink key={doc._id} id={doc._id} type={doc._type}>
              <Preview value={doc} type={schema.get(doc._type)} />
            </EditLink>
          ))
        ) : (
          <Feedback>This document has no Variants</Feedback>
        )}
      </Stack>
    </Box>
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
