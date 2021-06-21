import {useState, useEffect} from 'react'
import {useDocumentOperation} from '@sanity/react-hooks'
import {FiZap, FiZapOff} from 'react-icons/fi'

export function GoLive(props) {
  const {patch, publish} = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
  }, [props.draft])

  const {draft, published} = props
  const isMain = published?.branch === `main`
  const isLive = Boolean(published?.live)

  if (!isMain || draft) return null

  return {
    disabled: false,
    // eslint-disable-next-line no-nested-ternary
    label: isPublishing ? 'Updating...' : isLive ? `Remove Live` : `Make Live`,
    icon: isLive ? FiZapOff : FiZap,
    onHandle: () => {
      setIsPublishing(true)

      patch.execute([{set: {live: !isLive}}])

      publish.execute()
      props.onComplete()
    },
  }
}
