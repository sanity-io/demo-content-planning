/* eslint-disable react/jsx-no-bind */
import React, {useMemo, useEffect, useState} from 'react'
import {useDocumentOperation} from '@sanity/react-hooks'
import {FiFlag} from 'react-icons/fi'
import sanityClient from 'part:@sanity/base/client'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export function PublishRelease(props) {
  const {id, type, draft, published} = props
  const doc = useMemo(() => draft || published, [])
  const ops = useDocumentOperation(id, type)

  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
  }, [props.draft])

  function onHandle() {
    if (!doc?.articles) return

    const transaction = client.transaction()

    doc.articles.forEach((article) => transaction.patch(article._ref, (p) => p.set({live: true})))

    transaction.commit().then((res) => {
      setIsPublishing(false)
    })
  }

  if (type !== 'release') return null

  const count = doc?.articles?.length ?? 0

  return {
    // disabled: ops.publish.disabled || !count,
    disabled: !count,
    icon: FiFlag,
    shortcut: 'mod+shift+p',
    label: `${isPublishing ? `Releasing...` : `Release`} ${
      count === 1 ? `1 Article` : `${count} Articles`
    }`,
    onHandle,
  }
}
