/* eslint-disable react/jsx-no-bind */
import React, {useState, useEffect} from 'react'
import {FiGitBranch} from 'react-icons/fi'
import {nanoid} from 'nanoid'
import {Grid, Label, TextInput, Button, Flex} from '@sanity/ui'
import {IntentLink} from 'part:@sanity/base/router'
import sanityClient from 'part:@sanity/base/client'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export function CreateBranch(props) {
  const {id, type, draft, published} = props
  const doc = draft || published

  const [isPublishing, setIsPublishing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [value, setValue] = useState(``)
  const [branchCreated, setBranchCreated] = useState(false)
  const [branchId, setbranchId] = useState(``)

  useEffect(() => {
    if (isPublishing && !draft) {
      setIsPublishing(false)
    }
  }, [draft])

  if (doc?.branch !== `main`) return null

  function createBranch() {
    setIsPublishing(true)

    const originalDoc = props.draft ?? props.published
    const newBranchId = [id, nanoid().slice(0, 10)].join(`.`)
    setbranchId(newBranchId)
    const branchDoc = {
      ...originalDoc,
      _id: newBranchId,
      branch: value,
      live: false,
    }

    client.create(branchDoc).then((res) => {
      setIsPublishing(false)
      // setValue(``)
      setBranchCreated(true)
      // setDialogOpen(false)
      // props.onComplete()
      // router.encode({intent: 'edit', params: {id: branchId, type}})
    })
  }

  return {
    disabled: published?.branch !== 'main',
    label: isPublishing ? 'Forking...' : 'Create Branch',
    dialog: dialogOpen && {
      type: 'modal',
      content: (
        <Grid gap={2}>
          {branchCreated ? (
            <IntentLink intent="edit" params={{id: branchId, type}}>
              <Button
                style={{pointerEvents: `none`, textDecoration: `none`}}
                icon={FiGitBranch}
                padding={2}
                tone="positive"
                text={`Edit "${value}" Branch`}
              />
            </IntentLink>
          ) : (
            <>
              <Label>Branch Name</Label>
              <Flex>
                <TextInput
                  style={{width: `100%`}}
                  onChange={(event) => setValue(event.currentTarget.value)}
                  value={value}
                />
                <Button
                  style={{marginLeft: 10}}
                  padding={2}
                  tone="positive"
                  icon={FiGitBranch}
                  onClick={() => createBranch()}
                  text="Create"
                />
              </Flex>
            </>
          )}
        </Grid>
      ),
      onClose: props.onComplete,
    },
    onHandle: () => {
      setDialogOpen(true)
    },
    icon: FiGitBranch,
  }
}
