import PropTypes from 'prop-types'
import React from 'react'
import {Box, Text, Grid, Label, TextInput, Button, Flex} from '@sanity/ui'
import {FiGitBranch} from 'react-icons/fi'

export default function CreateVariantInput({value, validity, onChange, onClick}) {
  return (
    <Grid gap={2}>
      <Label>Variant Name</Label>
      <Flex>
        <Box style={{flex: 1, paddingRight: `1rem`}}>
          <TextInput onChange={onChange} value={value} customValidity={validity} />
        </Box>
        <Button padding={2} tone="positive" icon={FiGitBranch} onClick={onClick} text="Create" />
      </Flex>
      {validity && (
        <Box>
          <Text size={2}>{validity}</Text>
        </Box>
      )}
    </Grid>
  )
}

CreateVariantInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  validity: PropTypes.string,
  value: PropTypes.string,
}

CreateVariantInput.defaultProps = {
  validity: ``,
  value: ``,
}
