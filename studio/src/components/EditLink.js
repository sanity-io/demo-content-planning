import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {usePaneRouter} from '@sanity/desk-tool'
import {Box, Button} from '@sanity/ui'

export default function EditLink({id, type, children}) {
  const router = usePaneRouter()

  const handleClick = () => {
    router.navigateIntent('edit', {
      id,
      type,
    })
  }

  return (
    <Button style={{width: `100%`}} mode="bleed" onClick={handleClick}>
      <Box padding={2}>{children}</Box>
    </Button>
  )
}

EditLink.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}
