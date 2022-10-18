import { chatHeaderTemplate } from "../../components/chat-header/chatHeader";
import { chatBodyTemplate } from "../../components/chat-body/chatBodyPanel";
import { chatMessageTemplate } from "../../components/chat-message-panel/chatMessagePanel";

export const chatListRigthPanelTemplate = `
<div class="right-panel-container #isActiveChat#">
    <div class="inactive-panel">Выберите чат, чтобы отправить сообщение</div>
    <div class="active-panel">
        ${chatHeaderTemplate}
        ${chatBodyTemplate}
        ${chatMessageTemplate}
    </div>
</div>
`;