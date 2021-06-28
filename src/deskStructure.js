import S from '@sanity/desk-tool/structure-builder'
import {FiFileText} from 'react-icons/fi'
import DEFAULT_VARIANT from './lib/defaultVariant'

import DocumentVariants from './components/DocumentVariants'

export default () => {
  return S.list()
    .id('__root__')
    .title('Content')
    .items([
      S.listItem()
        .title(`Articles`)
        .id(`article`)
        .icon(FiFileText)
        .child(
          S.documentTypeList(`article`)
            .title('Articles')
            .filter(`variant == "${DEFAULT_VARIANT}"`)
            .child((id) =>
              S.document()
                .schemaType(`article`)
                .documentId(id)
                .views([S.view.form(), S.view.component(DocumentVariants).title(`Variants`)])
            )
        ),
      S.documentTypeListItem('release').title('Releases'),
    ])
}
