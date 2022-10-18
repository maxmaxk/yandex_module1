export const chatBodyTemplate = `
<div class="chat-body__container">
    <ul>
        <*li class="chat-body__message_#message.type#">
            <div class="chat-body__message-content">#message.content#</div>
            <div class="chat-body__message-info">
                <div class="chat-body__message-status #message.status#"></div><div>#message.time#</div>
            </div>
        </li*>
    </ul>
</div>
`;
