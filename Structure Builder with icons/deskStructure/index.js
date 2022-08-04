// /deskStructure.js
import S from '@sanity/desk-tool/structure-builder'
import pages from './pages';
import news from './news';
import jobs from './jobs';
import testimonials from './testimonials';
import publication from './publication';
import siteSettings from './siteSettings';
import dashForm from './dashForm'
import dashResults from './dashResults';


// Hide document types that we already have a structure definition for
const hiddenDocTypes = (listItem) =>
    ![
        "siteSettings",
        "media.tag",
        "news",
        "home",
        "landingpage",
        "publication",
        "testimonial",
        "jobs"

    ].includes(listItem.getId());

export default () =>
    S.list()
        .title('Content')
        .items([
            pages,
            S.divider(),
            news,
            publication,
            testimonials,
            jobs,
            S.divider(),
            siteSettings,

            ...S.documentTypeListItems().filter(hiddenDocTypes)
        ])