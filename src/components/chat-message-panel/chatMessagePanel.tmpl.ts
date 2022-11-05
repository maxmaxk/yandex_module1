export const chatMessageTemplate: string = `
<form class="chat-message__container" method="post" id="chat-message-form">
    <div class="chat-message__addon"></div>
    <textarea class="chat-message__input #isInvalidClass#" id="#message_name#" name="#message_name#">#value#</textarea>
    <button class="chat-message__sendbtn">Отправить</button>
</form>
`;