import S from '@sanity/desk-tool/structure-builder'
import {FiFileText} from 'react-icons/fi'

import DocumentBranches from './components/DocumentBranches'

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
            .filter('branch == "main"')
            .child((id) =>
              S.document()
                .schemaType(`article`)
                .documentId(id)
                .views([S.view.form(), S.view.component(DocumentBranches).title(`Branches`)])
            )
        ),
      S.documentTypeListItem('release').title('Releases'),
    ])
}
