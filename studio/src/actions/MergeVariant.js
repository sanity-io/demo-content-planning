/* eslint-disable react/jsx-no-bind */
import React, {useState, useEffect, useMemo} from 'react'
import {useDocumentOperation} from '@sanity/react-hooks'
import {FiGitPullRequest} from 'react-icons/fi'
import {useRouter} from 'part:@sanity/base/router'

import sanityClient from 'part:@sanity/base/client'
import DocumentDiff from '../components/DocumentDiff'
import DEFAULT_VARIANT from '../lib/defaultVariant'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export function MergeVariant({id, type, draft, published, onComplete}) {
  const router = useRouter()

  const {publish} = useDocumentOperation(id, type)
  const [isPublishing, setIsPublishing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [docMain, setDocMain] = useState({})
  const docVariant = useMemo(() => draft || published, [draft, published])
  const isMain = docVariant?.variant === DEFAULT_VARIANT
  const [patchDoc, setPatchDoc] = useState({})

  function keyHandler(e) {
    if (e.key === 'Escape') {
      setDialogOpen(false)
      onComplete()
    }
  }

  useEffect(() => {
    window.addEventListener('keyup', keyHandler)

    return () => {
      window.removeEventListener('keyup', keyHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!docVariant?.variant || isMain) return null

  function onHandle() {
    setIsPublishing(true)
    setDialogOpen(true)

    const docPatched = {...published, variant: DEFAULT_VARIANT}
    delete docPatched._id

    setPatchDoc(docPatched)

    const mainId = isMain ? published?._id : published?._id.split('.').shift()

    return client.getDocument(mainId).then((res) => setDocMain(res))
  }

  function merge(mainId, newDoc) {
    if (!mainId) return null

    return client
      .patch(mainId)
      .set(newDoc)
      .commit()
      .then(() => {
        setIsPublishing(false)
        onComplete()

        return router.navigateIntent('edit', {
          id: mainId,
          type: newDoc._type,
        })
      })
  }

  return {
    disabled: !publish.disabled,
    icon: FiGitPullRequest,
    label: isPublishing ? 'In Progress...' : 'Begin Merge',
    title: publish.disabled
      ? `Compare "${docVariant?.variant}" to "${DEFAULT_VARIANT}"`
      : `Publish Variant to Begin Merge`,
    onHandle,
    dialog: dialogOpen && {
      type: 'modal',
      size: 'auto',
      padding: 'large',
      content: (
        <DocumentDiff
          main={docMain}
          variant={docVariant}
          merge={() => merge(docMain?._id, patchDoc)}
        />
      ),
      onClose: () => onComplete(),
    },
  }
}
