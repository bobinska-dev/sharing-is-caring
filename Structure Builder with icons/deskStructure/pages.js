import S from "@sanity/desk-tool/structure-builder";
import { VscBrowser } from "react-icons/vsc";

import home from './pages/home'
import landingpage from "./pages/landingpage";
import socialtreePage from "./pages/socialtreePage";

export default S.listItem()
    .title('Pages')
    .icon(VscBrowser)
    .child(
        S.list()
            .title('Pages')
            .items([

                home,
                S.divider(),
                landingpage,
                socialtreePage
            ])
    );
