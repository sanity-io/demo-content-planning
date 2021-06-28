import DEFAULT_VARIANT from '../lib/defaultVariant'

export function VariantBadge(props) {
  const latest = props?.draft ?? props?.published
  const variant = latest?.variant

  return {
    label: variant,
    color: variant === DEFAULT_VARIANT ? 'success' : 'caution',
  }
}
