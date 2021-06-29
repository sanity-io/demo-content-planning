import React from 'react'
import PropTypes from 'prop-types'
import {withDocument} from 'part:@sanity/form-builder'
import {Stack, Card, Box, Text, Flex} from '@sanity/ui'
import {FiGitBranch, FiGitCommit, FiSend, FiAlertOctagon, FiFileText, FiFile} from 'react-icons/fi'
import DEFAULT_VARIANT from '../../lib/defaultVariant'

const Message = React.forwardRef(({document}, ref) => {
  const {_id, variant, live, _createdAt} = document

  const isMain = variant === DEFAULT_VARIANT
  const isDraft = _id?.startsWith(`drafts.`)
  const isLive = Boolean(live)
  const isNew = !_createdAt

  let messageText = {}

  if (isNew) {
    messageText = {
      tone: `critical`,
      icon: <FiAlertOctagon />,
      message: (
        <>
          This <code>{variant}</code> Variant <strong>New</strong> Document is a{' '}
          <strong>Draft</strong>. It cannot be <strong>Referenced</strong> by other Documents or
          queried publicly outside of the Studio.
        </>
      ),
    }
  } else if (isDraft && isMain) {
    messageText = {
      tone: `transparent`,
      icon: <FiFile />,
      message: (
        <>
          This is the <code>{variant}</code> Document, currently <strong>Draft</strong>, but has
          been Published before. Unless <strong>Unpublished</strong> it can be Referenced. Until
          Published again its current content cannot be queried publicly outside of the Studio.
        </>
      ),
    }
  } else if (!isDraft && isMain && !isLive) {
    messageText = {
      tone: `primary`,
      icon: <FiFileText />,
      message: (
        <>
          This is the <code>{variant}</code> Document, currently <strong>Published</strong>. It can
          be <strong>Referenced</strong> by other Documents in the Dataset. You can create{' '}
          <strong>Variants</strong> of it. Custom Access Rules on this Dataset prevent it from being
          queried publicly outside of the Studio until <strong>Live</strong>.
        </>
      ),
    }
  } else if (!isDraft && isMain && isLive) {
    messageText = {
      tone: `positive`,
      icon: <FiSend />,
      message: (
        <>
          This <code>{variant}</code> Variant Document is <strong>Published</strong> and{' '}
          <strong>Live</strong>. It can be <strong>Referenced</strong> by other Documents in the
          Dataset and queried publicly outside of the Studio.
        </>
      ),
    }
  } else if (isDraft && !isMain) {
    messageText = {
      tone: `transparent`,
      icon: <FiGitBranch />,
      message: (
        <>
          This <code>{variant}</code> Variant Document is a <strong>Draft</strong>. It should not be{' '}
          <strong>Referenced</strong>. It will need to be <strong>Committed (Published)</strong>{' '}
          before being able to merge back into the <code>main</code> Variant.
        </>
      ),
    }
  } else if (!isDraft && !isMain) {
    messageText = {
      tone: `caution`,
      icon: <FiGitCommit />,
      message: (
        <>
          This <code>{variant}</code> Variant Document is <strong>Published</strong>. It should not
          be <strong>Referenced</strong>. The <code>.</code> in its <code>_id</code> prevents it
          from being queried publicly outside of the Studio. It can now be merged into the{' '}
          <code>{DEFAULT_VARIANT}</code> Variant.
        </>
      ),
    }
  } else {
    messageText = {
      tone: `critical`,
      icon: null,
      message: <>This Document is in an unexplainable state.</>,
    }
  }

  return (
    <Stack space={2}>
      <input ref={ref} style={{display: `none`}} />
      <Card tone={messageText.tone} border padding={[2, 3]} radius={[1, 2]}>
        <Flex>
          {messageText.icon && <Box marginRight={2}>{messageText.icon}</Box>}
          <Box paddingLeft={messageText.icon ? 2 : 0}>
            <Text size={1}>{messageText.message}</Text>
          </Box>
        </Flex>
      </Card>
    </Stack>
  )
})

Message.propTypes = {
  document: PropTypes.shape({
    _createdAt: PropTypes.string,
    _id: PropTypes.string,
    variant: PropTypes.string,
    live: PropTypes.bool,
  }).isRequired,
}

Message.displayName = 'Message'

export default withDocument(Message)
