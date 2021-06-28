/* eslint-disable react/jsx-no-bind */
import React, {useState, useEffect} from 'react'
import {FiGitBranch} from 'react-icons/fi'
import {nanoid} from 'nanoid'
import {Grid, Label, TextInput, Button, Flex} from '@sanity/ui'
import {useRouter} from 'part:@sanity/base/router'
import sanityClient from 'part:@sanity/base/client'
import DEFAULT_VARIANT from '../lib/defaultVariant'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export function CreateVariant(props) {
  const router = useRouter()
  const {id, type, draft, published} = props
  const doc = draft || published

  const [isPublishing, setIsPublishing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [value, setValue] = useState(``)

  useEffect(() => {
    if (isPublishing && !draft) {
      setIsPublishing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  if (doc?.variant !== DEFAULT_VARIANT) return null

  function createVariant() {
    setIsPublishing(true)

    const originalDoc = props.draft ?? props.published
    const newVariantId = [id, nanoid().slice(0, 10)].join(`.`)

    const variantDoc = {
      ...originalDoc,
      _id: newVariantId,
      variant: value,
      live: false,
    }

    client
      .create(variantDoc)
      .then(() => {
        setIsPublishing(false)
        return router.navigateIntent('edit', {id: newVariantId, type})
      })
      .catch((err) => {
        setIsPublishing(false)
        console.error(err)
      })
  }

  return {
    disabled: published?.variant !== DEFAULT_VARIANT,
    label: isPublishing ? 'Forking...' : 'Create Variant',
    dialog: dialogOpen && {
      type: 'modal',
      content: (
        <Grid gap={2}>
          <Label>Variant Name</Label>
          <Flex>
            <TextInput onChange={(event) => setValue(event.currentTarget.value)} value={value} />
            <Button
              padding={2}
              tone="positive"
              icon={FiGitBranch}
              onClick={() => createVariant()}
              text="Create"
            />
          </Flex>
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
