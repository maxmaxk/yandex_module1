import { chatItemTemplate } from "../chat-item/chatItem.tmpl";
export const chatItemsTemplate: string = `
    <*li class="chat-item__container#chatitem.isActiveClass#" id=#id#>${chatItemTemplate}</li*>
`;