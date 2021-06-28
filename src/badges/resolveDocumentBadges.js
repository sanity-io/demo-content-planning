import defaultResolve from 'part:@sanity/base/document-badges'

import {VariantBadge} from './VariantBadge'

export default function resolveDocumentBadges(props) {
  return [...defaultResolve(props), VariantBadge]
}
