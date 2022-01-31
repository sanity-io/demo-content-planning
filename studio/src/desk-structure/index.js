import S from '@sanity/desk-tool/structure-builder'
import {FiFileText} from 'react-icons/fi'
import Iframe from 'sanity-plugin-iframe-pane'

import DEFAULT_VARIANT from '../lib/defaultVariant'
import resolveProductionUrl from '../lib/resolveProductionUrl'
import DocumentVariants from '../components/DocumentVariants'

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
                .views([
                  S.view.form(),
                  S.view.component(DocumentVariants).title(`Variants`),
                  S.view
                    .component(Iframe)
                    .options({
                      url: (doc) => resolveProductionUrl(doc),
                    })
                    .title('Preview'),
                ])
            )
        ),
      S.documentTypeListItem('release').title('Releases'),
    ])
}
