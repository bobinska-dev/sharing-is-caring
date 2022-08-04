
import { MdEdit, MdAssignmentInd } from "react-icons/md";
import { VscBriefcase } from "react-icons/vsc";
import S from "@sanity/desk-tool/structure-builder";



export default S.listItem()
    .title("Jobs")
    .schemaType("jobs")
    .icon(VscBriefcase)
    .child(
        S.documentTypeList("jobs")
            .title("Jobs")
            .child((documentId) =>
                S.document()
                    .documentId(documentId)
                    .schemaType("jobs")
                    .views([S.view.form().icon(MdEdit)])
            )
    );