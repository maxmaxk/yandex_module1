import { topMenuTemplate } from "../../components/top-menu/topMenu.tmpl";
import { searchPanelTemplate } from "../../components/search-panel/searchPanel.tmpl";
import { chatItemTemplate } from "../../components/chat-item/chatItem.tmpl";
export const chatListLeftPanelTemplate = `
<div class="left-panel-container">
    ${topMenuTemplate}
    ${searchPanelTemplate}
    <ul class="chat-item-list">
        <*li class="chat-item__container#chatitem.isActiveClass#" id=#id# onclick="#onChatItemActivate#">${chatItemTemplate}</li*>
    <ul>
</div>
`;