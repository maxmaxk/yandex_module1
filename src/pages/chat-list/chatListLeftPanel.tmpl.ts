import { topMenuTemplate } from "../../components/top-menu/topMenu.tmpl";
import { searchPanelTemplate } from "../../components/search-panel/searchPanel.tmpl";

export const chatListLeftPanelTemplate = `
<div class="left-panel-container">
    ${topMenuTemplate}
    ${searchPanelTemplate}
    #chatItems#
</div>
`;
