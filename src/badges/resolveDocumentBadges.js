import defaultResolve from 'part:@sanity/base/document-badges'

import {BranchBadge} from './BranchBadge'

export default function resolveDocumentBadges(props) {
  return [...defaultResolve(props), BranchBadge]
}
