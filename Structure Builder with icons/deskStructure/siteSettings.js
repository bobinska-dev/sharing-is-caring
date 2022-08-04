import S from "@sanity/desk-tool/structure-builder";
import { MdEdit } from "react-icons/md";
import { BsTools } from "react-icons/bs";
import { HiOutlineEye } from "react-icons/hi";

export default S.listItem()

    .title('Site Settings')
    .schemaType('siteSettings')
    .icon(BsTools)
    .child(
        S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Edit Settings')
            .views([
                S.view.form().icon(MdEdit),
            ]),

    )