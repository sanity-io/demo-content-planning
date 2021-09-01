import React, {useEffect, useState, useMemo} from 'react'
import ErrorPage from 'next/error'
import {useRouter} from 'next/router'
import {groq} from 'next-sanity'
import {Listbox} from '@headlessui/react'
import {nanoid} from 'nanoid'

import {usePreviewSubscription} from '../lib/sanity'
import {getClient} from '../lib/sanity.server'
import DEFAULT_VARIANT from '../../studio/src/lib/defaultVariant'

const articleQuery = groq`
  *[_type == "article" && variant == $default && slug.current == $slug][0] {
    _id,
    variant,
    title,
    content,
    "slug": slug.current,
    "variants": *[_type == "article" && _id in path($mainId + ".*") && variant != $default]
  }
`

export default function Article({data, preview}) {
  const router = useRouter()

  const {data: article} = usePreviewSubscription(articleQuery, {
    params: data?.queryParams,
    initialData: data?.article,
    enabled: preview && data?.article?.slug,
  })

  const [variantOptions, setVariantOptions] = useState([DEFAULT_VARIANT])
  const [variantSelected, setVariantSelected] = useState(DEFAULT_VARIANT)
  const [articleDisplayed, setArticleDisplayed] = useState(article)

  function handleSelect(value) {
    setVariantSelected(value)
  }

  // Update dropdown list when article changes
  useEffect(() => {
    if (article?.variants?.length) {
      setVariantOptions([DEFAULT_VARIANT, ...article.variants.map((doc) => doc.variant)])
    }
  }, [article])

  // Update displayed article
  useEffect(() => {
    if (article?.variants?.length) {
      setArticleDisplayed(
        variantSelected === DEFAULT_VARIANT
          ? article
          : article.variants.find((doc) => doc.variant === variantSelected)
      )
    }
  }, [article, variantSelected])

  // Create new paragraph keys
  const content = useMemo(() => {
    const paragraphData = articleDisplayed?.content ?? article?.content

    if (paragraphData) {
      return paragraphData
        .split('\n')
        .filter((p) => p)
        .map((text) => ({
          key: nanoid(),
          text,
        }))
    }

    return []
  }, [article, articleDisplayed])

  if ((!router.isFallback && !data?.article?.slug) || !articleDisplayed) {
    return <ErrorPage statusCode={404} />
  }

  const {title} = articleDisplayed

  return (
    <article className="p-4 md:px-4 md:py-8 xl:px-8 xl:py-16">
      <div className="mx-auto" style={{maxWidth: `65ch`}}>
        <h1 className="text-pink-600 text-4xl md:text-7xl lg:text-7xl font-black mb-4 md:mb-8 lg:mb-12">
          {title}
        </h1>
      </div>
      <div className="prose prose-red container mx-auto">
        {content.map(({key, text}) => (
          <p key={key}>{text}</p>
        ))}
      </div>

      {variantOptions?.length && (
        <div className="fixed inset-0 pointer-events-none flex justify-start items-end p-4">
          <div className="pointer-events-auto flex items-center p-2 rounded-lg bg-gradient-to-bl from-yellow-400 via-red-500 to-pink-500 text-white shadow">
            <span className="text-xs font-bold uppercase tracking-widest pl-2 pr-4">
              {variantOptions.length === 1 ? `1 Variant` : `${variantOptions?.length} Variants`}
            </span>

            <div className="relative w-32">
              <Listbox value={variantSelected} onChange={handleSelect}>
                <Listbox.Button className="w-full cursor-pointer font-mono text-sm bg-white shadow text-pink-700 px-4 py-2 rounded block">
                  {variantSelected}
                </Listbox.Button>
                <Listbox.Options className="w-full absolute z-50 bottom-full bg-white divide-y divide-gray-100 shadow transform -translate-y-1 rounded text-center">
                  {variantOptions.map((opt) => (
                    <Listbox.Option
                      className="cursor-pointer font-mono text-sm text-pink-700 hover:text-pink-500 px-4 py-2 rounded block"
                      value={opt}
                      key={opt}
                    >
                      {opt}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export async function getStaticProps({params, preview = true}) {
  const queryParams = {
    slug: params.slug,
    default: DEFAULT_VARIANT, // Ensures we're only querying for the Main document
    mainId: ``, // Will update later once we have the _id
  }

  const article = await getClient(preview).fetch(articleQuery, queryParams)

  if (article?._id) {
    queryParams.mainId = article._id
  }

  return {
    props: {
      preview,
      data: {article, queryParams},
    },
  }
}

export async function getStaticPaths() {
  const paths = await getClient().fetch(
    groq`*[_type == "article" && variant == $default && defined(slug.current)][].slug.current`,
    {default: DEFAULT_VARIANT}
  )

  return {
    paths: paths.map((slug) => ({params: {slug}})),
    fallback: true,
  }
}
