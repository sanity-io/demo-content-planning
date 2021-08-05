import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import {FormField} from '@sanity/base/components'
import {Select} from '@sanity/ui'
import {withDocument} from 'part:@sanity/form-builder'
import sanityClient from 'part:@sanity/base/client'
import PatchEvent, {set, unset} from '@sanity/form-builder/PatchEvent'

import DEFAULT_VARIANT from '../lib/defaultVariant'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})
const defaultDetails = {ref: ``, options: []}

const VariantSelector = React.forwardRef((props, ref) => {
  const {
    document: sanityDocument, // Document
    type, // Schema information
    value, // Current field value
    readOnly, // Boolean if field is not editable
    placeholder, // Placeholder text from the schema
    markers, // Markers including validation rules
    presence, // Presence information for collaborative avatars
    compareValue, // Value to check for "edited" functionality
    onFocus, // Method to handle focus state
    onBlur, // Method to handle blur state,
    onChange,
    focusPath,
  } = props

  const [details, setDetails] = useState(defaultDetails)
  const variantRef = sanityDocument?.variantSelector?.article?._ref

  console.log({focusPath, props, ref: ref?.current})

  // Handle a change to the reference
  useEffect(() => {
    function getVariants() {
      const id = variantRef.replace('drafts.', '')
      const query = '*[_type == "article" && defined(variant) && _id in path($id)].variant'
      const params = {id: `${id}.*`}

      return client
        .fetch(query, params)
        .then((res) => setDetails({ref: id, options: [DEFAULT_VARIANT, ...res]}))
        .catch((err) => console.error(err))
    }

    if (!defaultDetails.options.length && variantRef && variantRef !== defaultDetails.ref) {
      // Get variants (because the ref has changed)
      getVariants()
    } else if (!variantRef) {
      // Reset value (because the ref has been removed / doesn't exist)
      onChange(PatchEvent.from(unset()))
      setDetails(defaultDetails)
    }
  }, [details, sanityDocument?.variantSelector?.article?._ref])

  // Handle a change on this select menu
  function handleChange(event) {
    const selectValue = event?.target?.value
    onChange(PatchEvent.from(selectValue ? set(selectValue) : unset()))
  }

  return (
    <FormField
      description={type.description} // Creates description from schema
      title={type.title} // Creates label from schema title
      __unstable_markers={markers} // Handles all markers including validation
      __unstable_presence={presence} // Handles presence avatars
      compareValue={compareValue} // Handles "edited" status
    >
      {JSON.stringify(sanityDocument.articles)}
      <Select
        value={value} // Current field value
        readOnly={readOnly || !details.options?.length > 0} // If "readOnly" is defined make this field read only
        placeholder={placeholder} // If placeholder is defined, display placeholder text
        onFocus={onFocus} // Handles focus events
        onBlur={onBlur} // Handles blur events
        ref={ref}
        onChange={handleChange}
      >
        {details.options?.length > 0 ? (
          details.options.map((option) => <option key={option}>{option}</option>)
        ) : (
          <option>
            {details.ref && details.options.length === 0
              ? `Article has no Variants`
              : `Select an Article`}
          </option>
        )}
      </Select>
    </FormField>
  )
})

VariantSelector.propTypes = {
  compareValue: PropTypes.any,
  markers: PropTypes.any,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  presence: PropTypes.any,
  readOnly: PropTypes.bool,
  type: PropTypes.shape({
    description: PropTypes.string,
    title: PropTypes.string,
  }),
  value: PropTypes.string,
}

VariantSelector.displayName = 'VariantSelector'

// Create the default export to import into our schema
export default withDocument(VariantSelector)
