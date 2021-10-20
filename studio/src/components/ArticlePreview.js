import PropTypes from 'prop-types'
import React from 'react'
import {FiFileText} from 'react-icons/fi'
import {Flex, Card} from '@sanity/ui'

export default function ArticlePreview({_id, live}) {
  return (
    <Card
      // eslint-disable-next-line no-nested-ternary
      tone={_id.startsWith('drafts.') ? `transparent` : live ? `positive` : `primary`}
      border
      radius={[1, 2]}
      style={{width: `90%`, height: `90%`}}
    >
      <Flex justify="center" align="center" style={{width: `100%`, height: `100%`}}>
        <FiFileText />
      </Flex>
    </Card>
  )
}

ArticlePreview.propTypes = {
  _id: PropTypes.string,
  live: PropTypes.bool,
}

ArticlePreview.defaultProps = {
  _id: ``,
  live: false,
}
