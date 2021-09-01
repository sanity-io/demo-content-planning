import PropTypes from 'prop-types'
import React from 'react'
import {diffString} from 'json-diff'
import {Flex, Button} from '@sanity/ui'
import {FiGitMerge} from 'react-icons/fi'

export default function DocumentDiff({main, variant, merge}) {
  // console.log({main, variant})
  const outputString = diffString(main, variant)

  return (
    <div style={{height: `80vh`, width: `80vw !important`, maxWidth: `none`}}>
      {outputString
        .split('\n')
        .filter((line) => line?.length > 2)
        .map((line) => (
          <code
            key={line}
            style={{
              display: `block`,
              backgroundColor: line.includes('- ') ? `#FEF2F2` : `#ECFDF5`,
              color: line.includes('- ') ? `#EF4444` : `#10B981`,
            }}
          >
            {line}
          </code>
        ))}
      <Flex marginTop={4} justify="space-between">
        <Button
          onClick={merge}
          text={`Merge "${variant.variant}" into "${main.variant}"`}
          tone="positive"
          icon={FiGitMerge}
        />
      </Flex>
    </div>
  )
}

DocumentDiff.propTypes = {
  main: PropTypes.shape({
    variant: PropTypes.string.isRequired,
  }).isRequired,
  merge: PropTypes.func.isRequired,
  variant: PropTypes.shape({
    variant: PropTypes.string.isRequired,
  }).isRequired,
}
