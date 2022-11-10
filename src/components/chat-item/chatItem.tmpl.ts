export const chatItemTemplate = `
<img class="chat-item__image" alt="#chatitem.name#" src="#chatitem.image#"></img>
<div class="chat-item__title">
    <span><b>#chatitem.name#</b></span>
    <div>
        <span><b>#chatitem.lastMessageOwn#</b></span>
        <span class="chat-item__last-message">#chatitem.lastMessage#</span>
    </div>
</div>
<div class="chat-item__info">
    <span class="chat-item__time">#chatitem.time#</span>
    <span data-content="#chatitem.unreadCount#" class="chat-item__unread-count">#chatitem.unreadCount#</span>
</div>
`;
