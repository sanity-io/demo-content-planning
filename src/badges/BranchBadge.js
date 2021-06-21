export function BranchBadge(props) {
  const latest = props?.draft ?? props?.published
  const branch = latest?.branch

  return {
    label: branch,
    color: branch === 'main' ? 'success' : 'caution',
  }
}
