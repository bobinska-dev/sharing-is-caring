import S from "@sanity/desk-tool/structure-builder";
import { VscBell } from "react-icons/vsc";
import { MdEdit } from "react-icons/md";
import { HiOutlineEye } from "react-icons/hi";
import resolveProductionUrl from '../previews/previewNews'
import Iframe from 'sanity-plugin-iframe-pane'
import SocialPreview from 'part:social-preview/component'
import { basePath } from "../basePath";


export default S.listItem()
    .title("News")
    .schemaType("news")
    .icon(VscBell)
    .child(
        S.documentTypeList("news")
            .title("News")
            .child((documentId) =>
                S.document()
                    .documentId(documentId)
                    .schemaType("news")
                    .views(
                        [S.view.form().icon(MdEdit),
                        S.view.component(SocialPreview({
                            // Overwrite prepareFunction to pick the right fields
                            prepareFunction: (
                                { description, title, image, slug },
                            ) => ({
                                title,
                                siteUrl: basePath,
                                description,
                                ogImage: image,
                                slug: slug.current

                            }),
                        }),
                        ).title('Social & SEO').icon(HiOutlineEye),
                        S.view.component(Iframe).title('Web Preview').options({ url: (doc) => resolveProductionUrl(doc), }).icon(HiOutlineEye)
                        ])

            )
    );