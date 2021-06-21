/* eslint-disable react/jsx-no-bind */
import React, {useState, useMemo} from 'react'
import {useDocumentOperation} from '@sanity/react-hooks'
import {FiGitPullRequest} from 'react-icons/fi'

import sanityClient from 'part:@sanity/base/client'
import DocumentDiff from '../components/DocumentDiff'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export function MergeBranch(props) {
  const {id, type, draft, published} = props

  const {publish} = useDocumentOperation(id, type)
  const [isPublishing, setIsPublishing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [docMain, setDocMain] = useState({})
  const docBranch = useMemo(() => draft || published, [draft, published])
  const isMain = docBranch?.branch === `main`
  const [patchDoc, setPatchDoc] = useState({})

  if (!docBranch?.branch || isMain) return null

  function onHandle() {
    setIsPublishing(true)
    setDialogOpen(true)

    const docPatched = {...published, branch: 'main'}
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
      .then((res) => {
        setIsPublishing(false)
        props.onComplete()
      })
  }

  return {
    disabled: !publish.disabled,
    icon: FiGitPullRequest,
    label: isPublishing ? 'In Progress...' : 'Pull Request',
    title: publish.disabled
      ? `Diff "${docBranch?.branch}" against "main"`
      : `Commit changes to begin PR`,
    onHandle,
    dialog: dialogOpen && {
      type: 'modal',
      content: (
        <DocumentDiff
          main={docMain}
          branch={docBranch}
          merge={() => merge(docMain?._id, patchDoc)}
        />
      ),
    },
  }
}
