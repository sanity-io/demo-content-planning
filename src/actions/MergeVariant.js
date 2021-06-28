/* eslint-disable react/jsx-no-bind */
import React, {useState, useMemo} from 'react'
import {useDocumentOperation} from '@sanity/react-hooks'
import {FiGitPullRequest} from 'react-icons/fi'
import {useRouter} from 'part:@sanity/base/router'

import sanityClient from 'part:@sanity/base/client'
import DocumentDiff from '../components/DocumentDiff'
import DEFAULT_VARIANT from '../lib/defaultVariant'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export function MergeVariant(props) {
  const router = useRouter()
  const {id, type, draft, published} = props

  const {publish} = useDocumentOperation(id, type)
  const [isPublishing, setIsPublishing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [docMain, setDocMain] = useState({})
  const docVariant = useMemo(() => draft || published, [draft, published])
  const isMain = docVariant?.variant === DEFAULT_VARIANT
  const [patchDoc, setPatchDoc] = useState({})

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
        props.onComplete()
        return router.navigateIntent('edit', {id: mainId, type: newDoc._type})
      })
  }

  return {
    disabled: !publish.disabled,
    icon: FiGitPullRequest,
    label: isPublishing ? 'In Progress...' : 'Pull Request',
    title: publish.disabled
      ? `Diff "${docVariant?.variant}" against "${DEFAULT_VARIANT}"`
      : `Commit changes to begin PR`,
    onHandle,
    dialog: dialogOpen && {
      type: 'modal',
      content: (
        <DocumentDiff
          main={docMain}
          variant={docVariant}
          merge={() => merge(docMain?._id, patchDoc)}
        />
      ),
    },
  }
}
