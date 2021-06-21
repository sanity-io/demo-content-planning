import defaultResolve from 'part:@sanity/base/document-actions'

import {GoLive} from './GoLive'
import {CreateBranch} from './CreateBranch'
import {MergeBranch} from './MergeBranch'
import {PublishOrCommit} from './PublishOrCommit'
import {PublishRelease} from './PublishRelease'

export default function resolveDocumentActions(props) {
  const defaultActions = defaultResolve(props).filter((action) => action?.name !== `PublishAction`)

  return [PublishRelease, GoLive, PublishOrCommit, MergeBranch, CreateBranch, ...defaultActions]
}