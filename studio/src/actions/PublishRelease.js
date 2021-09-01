/* eslint-disable react/jsx-no-bind */
import {useMemo, useEffect, useState} from 'react'
import {useDocumentOperation} from '@sanity/react-hooks'
import {FiFlag} from 'react-icons/fi'

const remoteUrl = `https://demo-content-planning.sanity.build`
const localUrl = `http://localhost:3000`
const baseUrl = window.location.hostname === 'localhost' ? localUrl : remoteUrl

export function PublishRelease(props) {
  const {id, type, draft, published, onComplete} = props
  const doc = useMemo(() => draft || published, [draft, published])
  const {publish} = useDocumentOperation(id, type)

  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.draft])

  if (type !== 'release') return null

  function onHandle() {
    publish.execute()
    onComplete()
  }

  async function release() {
    if (!doc?.articles?.length) return

    const {_id, title, schedule, log} = doc

    // Merging these documents _could_ be done here in Sanity Studio
    // But it made sense to use the Serverless Function
    // To test that it works on-demand and on-schedule
    await fetch(`${baseUrl}/api/release`, {
      method: 'POST',
      // Because of CORS, this has to be a string from the Studio
      body: JSON.stringify({_id, title, schedule, log}),
    })
      .then((data) => data.json())
      .then((data) => {
        setIsPublishing(false)

        // console.log(data)
      })
      .catch((err) => console.error(err))
  }

  const count = doc?.articles?.length ?? 0

  return {
    disabled: !count,
    icon: FiFlag,
    shortcut: 'mod+shift+p',
    label:
      publish.disabled === 'ALREADY_PUBLISHED'
        ? `${isPublishing ? `Releasing...` : `${doc?.schedule ? `Schedule` : `Release`}`} ${
            count === 1 ? `1 Article` : `${count} Articles`
          }`
        : `Publish to Begin`,
    onHandle: publish.disabled === 'ALREADY_PUBLISHED' ? release : onHandle,
  }
}
