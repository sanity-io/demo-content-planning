import {useEffect, useState} from 'react'
import sanityClient from 'part:@sanity/base/client'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export const useDocuments = (id, query) => {
  const [documents, setDocuments] = useState([])

  const fetchDocuments = () => {
    client.fetch(query).then((res) => setDocuments(res))
  }

  useEffect(() => {
    let subscription

    if (id) {
      fetchDocuments()

      subscription = client.observable.listen(query).subscribe(() => {
        setTimeout(() => {
          fetchDocuments()
        }, 2500)
      })
    }

    return () => (subscription ? subscription.unsubscribe() : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return documents || []
}
