/* eslint-disable react/jsx-no-bind */
import {useDocumentOperation} from '@sanity/react-hooks'
import {MdPublish as PublishIcon} from 'react-icons/md'
import {FiGitCommit} from 'react-icons/fi'

export function PublishOrCommit(props) {
  const {id, type} = props
  const ops = useDocumentOperation(id, type)

  if (type !== 'article') return null

  const branch = props?.draft?.branch ?? props?.published?.branch

  const isPublished = !props.draft
  const shouldPublish = !branch || branch === `main`

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
    icon: shouldPublish ? PublishIcon : FiGitCommit,
    shortcut: 'mod+shift+p',
    label: shouldPublish ? 'Publish' : `Commit`,
    onHandle,
  }
}
