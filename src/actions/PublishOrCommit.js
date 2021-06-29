/* eslint-disable react/jsx-no-bind */
import {useDocumentOperation} from '@sanity/react-hooks'
import {MdPublish as PublishIcon} from 'react-icons/md'
import {FiGitCommit} from 'react-icons/fi'
import DEFAULT_VARIANT from '../lib/defaultVariant'

export function PublishOrCommit(props) {
  const {id, type} = props
  const ops = useDocumentOperation(id, type)

  if (type !== 'article') return null

  const variant = props?.draft?.variant ?? props?.published?.variant

  const isPublished = !props.draft
  const isMain = !variant || variant === DEFAULT_VARIANT

  // Display 'merge' instead on non-main published Docs
  if (isPublished) return null

  const onHandle = () => {
    if (ops.publish.disabled) {
      props.onComplete()
      return
    }

    ops.publish.execute()
    props.onComplete()
  }

  return {
    disabled: ops.publish.disabled,
    icon: isMain ? PublishIcon : FiGitCommit,
    shortcut: 'mod+shift+p',
    label: isMain ? 'Publish' : 'Prepare to Merge',
    onHandle,
  }
}
