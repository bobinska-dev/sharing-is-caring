import { IoBookOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

import S from "@sanity/desk-tool/structure-builder";



export default S.listItem()
    .title("Publications")
    .schemaType("publication")
    .icon(IoBookOutline)
    .child(
        S.documentTypeList("publication")
            .title("Publications")
            .child((documentId) =>
                S.document()
                    .documentId(documentId)
                    .schemaType("publication")
                    .views([S.view.form().icon(MdEdit)])
            )
    );