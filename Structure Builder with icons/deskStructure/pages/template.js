import S from "@sanity/desk-tool/structure-builder";
import { MdEdit } from "react-icons/md";
import { VscBrowser } from "react-icons/vsc";
import { HiOutlineEye } from "react-icons/hi";

import SocialPreview from 'part:social-preview/component'
import Iframe from 'sanity-plugin-iframe-pane'
import resolveProductionUrl from '../../previews/pagePreview'

// this is just a collection of all relevant urlpaths so I don't need to search 
import { basePathFull } from "../../basePath";

export default S.listItem()

    .title('name')
    .schemaType('PASTE_YOUR_TYPE_HERE')
    .icon(VscBrowser)
    .child(
        S.document()
            .schemaType('PASTE_YOUR_TYPE_HERE')
            .documentId('PASTE_YOUR_TYPE_HERE')
            .title('Edit Page')
            .views([
                S.view.form().icon(MdEdit),
                S.view.component(SocialPreview({
                    // Overwrite prepareFunction to pick the right fields
                    prepareFunction: (
                        { title, description, image, slug },
                    ) => ({
                        title: title,
                        siteUrl: basePathFull,
                        description,
                        ogImage: image,
                        slug: "name"
                    }),
                }),
                ).title('Social & SEO Preview').icon(HiOutlineEye),
                S.view.component(Iframe).title('Web Preview').options({ url: (doc) => resolveProductionUrl(doc), }).icon(HiOutlineEye)
            ]),

    )