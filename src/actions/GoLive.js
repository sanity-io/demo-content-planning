import {useState, useEffect} from 'react'
import {useDocumentOperation} from '@sanity/react-hooks'
import {FiZap, FiZapOff} from 'react-icons/fi'
import DEFAULT_VARIANT from '../lib/defaultVariant'

export function GoLive(props) {
  const {patch, publish} = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.draft])

  const {draft, published} = props
  const isMain = published?.variant === DEFAULT_VARIANT
  const isLive = Boolean(published?.live)

  if (!isMain || draft) return null

  return {
    disabled: false,
    dialog: dialogOpen && {
      type: 'confirm',
      onCancel: props.onComplete(),
      onConfirm: () => {
        patch.execute([{set: {live: !isLive}}])
        publish.execute()
        props.onComplete()
      },
      message: isLive ? `Confirm Remove Live` : `Confirm Make Live`,
    },
    // eslint-disable-next-line no-nested-ternary
    label: isPublishing ? 'Updating...' : isLive ? `Remove Live` : `Make Live`,
    icon: isLive ? FiZapOff : FiZap,
    onHandle: () => {
      setIsPublishing(true)
      setDialogOpen(true)
    },
  }
}
