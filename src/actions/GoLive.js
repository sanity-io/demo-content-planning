import {useState, useMemo, useEffect} from 'react'
import {useDocumentOperation} from '@sanity/react-hooks'
import {FiZap, FiZapOff} from 'react-icons/fi'
import DEFAULT_VARIANT from '../lib/defaultVariant'

export function GoLive({id, type, draft, published, onComplete}) {
  const {patch, publish} = useDocumentOperation(id, type)
  const doc = useMemo(() => draft || published, [draft, published])
  const [isPublishing, setIsPublishing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (isPublishing && !draft) {
      setIsPublishing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  const isMain = published?.variant === DEFAULT_VARIANT
  const isLive = Boolean(published?.live)

  if (!isMain || draft) return null

  return {
    disabled: false,
    dialog: dialogOpen && {
      type: 'confirm',
      color: 'success',
      onCancel: () => onComplete(),
      onConfirm: () => {
        patch.execute([{set: {live: !isLive}}])
        publish.execute()
        onComplete()
      },
      message: isLive
        ? `Hide ${`"${doc.title}"` ?? `this Document`} from being queried?`
        : `Make ${`"${doc.title}"` ?? `this Document`} publicly available?`,
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
