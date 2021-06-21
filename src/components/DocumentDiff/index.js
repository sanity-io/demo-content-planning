import React from 'react'
import {diffString} from 'json-diff'
import {Box, Button} from '@sanity/ui'
import {FiGitMerge} from 'react-icons/fi'

export default function DocumentDiff({main, branch, merge}) {
  const outputString = diffString(main, branch)

  return (
    <>
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
      <Box marginTop={4}>
        <Button
          onClick={merge}
          text={`Merge "${branch.branch}" into "${main.branch}"`}
          tone="positive"
          icon={FiGitMerge}
        />
      </Box>
    </>
  )
}
