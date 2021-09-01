/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import {nanoid} from 'nanoid'
import {FiGitBranch} from 'react-icons/fi'

import {useRouter} from 'part:@sanity/base/router'
import sanityClient from 'part:@sanity/base/client'

import CreateVariantInput from '../components/CreateVariantInput'
import DEFAULT_VARIANT from '../lib/defaultVariant'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export function CreateVariant({id, type, draft, published, onComplete}) {
  const router = useRouter()
  const doc = draft || published

  const [isPublishing, setIsPublishing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [value, setValue] = useState(``)
  const [validity, setValidity] = useState(``)

  useEffect(() => {
    if (isPublishing && !draft) {
      setIsPublishing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  if (doc?.variant !== DEFAULT_VARIANT) return null

  async function createVariant() {
    setIsPublishing(true)

    if (!value) {
      return setIsPublishing(false)
    }

    // Check first for other Variants with this name
    const conflictingVariants = await client.fetch(`*[_id in path($id) && variant == $name]`, {
      id: `${id}.*`,
      name: value,
    })

    // Warn user and do not proceed
    if (conflictingVariants?.length) {
      return setValidity(`A Variant with the name "${value}" already exists`)
    }

    const newVariantId = [id, nanoid().toLowerCase().slice(0, 10)].join(`.`)
    const originalDoc = draft ?? published

    const variantDoc = {
      ...originalDoc,
      _id: newVariantId,
      variant: value,
      live: false,
    }

    return client
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

  function handleChange(e) {
    // Update input
    setValue(e.currentTarget.value)

    // Reset validity on key change
    if (validity) setValidity(``)
  }

  return {
    disabled: published?.variant !== DEFAULT_VARIANT,
    label: isPublishing ? 'Creating...' : 'Create Variant',
    dialog: dialogOpen && {
      type: 'modal',
      content: (
        <CreateVariantInput
          value={value}
          validity={validity}
          onChange={handleChange}
          onClick={() => createVariant()}
        />
      ),
      onClose: () => onComplete(),
    },
    onHandle: () => {
      setDialogOpen(true)
    },
    icon: FiGitBranch,
  }
}

CreateVariant.propTypes = {
  draft: PropTypes.object,
  id: PropTypes.string,
  onComplete: PropTypes.func,
  published: PropTypes.shape({
    variant: PropTypes.string,
  }),
  type: PropTypes.string,
}
