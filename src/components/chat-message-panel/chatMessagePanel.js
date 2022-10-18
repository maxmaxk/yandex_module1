export const chatMessageTemplate = `
<form class="chat-message__container" method="post" onsubmit="#onSendMessage#">
    <div class="chat-message__addon" onclick="#onChatAddon#"></div>
    <textarea class="chat-message__input" oninput="#onMessageChange#" name="#message_name#"></textarea>
    <button class="chat-message__sendbtn">Отправить</button>
</form>
`;