import S from "@sanity/desk-tool/structure-builder";
import { MdEdit } from "react-icons/md";
import { VscBrowser } from "react-icons/vsc";
import { HiOutlineEye } from "react-icons/hi";

import SocialPreview from 'part:social-preview/component'
import Iframe from 'sanity-plugin-iframe-pane'
import resolveProductionUrl from '../../previews/pagePreview'
import { basePathFull } from "../../basePath";

export default S.listItem()
    .title('Home Page')
    .schemaType('home')
    .icon(VscBrowser)
    .child(
        S.document()
            .schemaType('home')
            .documentId('home')
            .title('Edit Page')
            .views([
                S.view.form().icon(MdEdit),

                S.view.component(SocialPreview({
                    // Overwrite prepareFunction to pick the right fields
                    prepareFunction: (
                        { description, title, image },
                    ) => ({
                        title,
                        siteUrl: basePathFull,
                        description,
                        ogImage: image,
                        slug: "."
                    })
                }))
                    .title('Social & SEO Preview')
                    .icon(HiOutlineEye),

                S.view.component(Iframe).title('Web Preview')
                    .options({ url: (doc) => resolveProductionUrl(doc), })
                    .icon(HiOutlineEye)
            ]),
    )