import S from "@sanity/desk-tool/structure-builder";
import { MdEdit } from "react-icons/md";
import { VscComment } from "react-icons/vsc";




export default S.listItem()
    .title("Testimonials")
    .schemaType("testimonial")
    .icon(VscComment)
    .child(
        S.documentTypeList("testimonial")
            .title("Testimonials")
            .child((documentId) =>
                S.document()
                    .documentId(documentId)
                    .schemaType("testimonial")
                    .views([S.view.form().icon(MdEdit)])
            )
    );