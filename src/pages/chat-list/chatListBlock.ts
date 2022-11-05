import { Block } from "../../common/block";
import { state } from "../../common/state";
import { chatListTemplate } from "./chatList.tmpl";
import { pages } from "../pages";
import { testChatList, testMessageList, updateTestMessageList } from "./chatListContext";
import { ChatItems } from "../../components/chat-items/chatItems";
import { ChatFlow } from "../../components/chat-flow/chatFlow";

import { Handlers } from "../../common/handlers";
import { EventBus } from "../../common/eventBus";

export class ChatListBlock extends Block{
    constructor(){
        const getActiveChat = () => {
            return testChatList()[state.activeChatId];
        }
        const getIsActiveChat = (): string => {
            return state.activeChatId < 0 ? "inactive-message" : "active-message"
        }
        super("div", {
            attr: {class: "panelcontainer"}, 
            profileUrl: pages.profile.url,
            addChatText: "Добавить чат",
            removeChatText: "УДАЛИТЬ ЧАТ",
            isActiveChat: getIsActiveChat(),
            chatHeaderImage: getActiveChat()?.image,
            chatHeaderTitle:  getActiveChat()?.name,
            message_name: "message",
            isInvalidClass: "",
            value: "",
            chatItems: new ChatItems("ul",{
                attr: {class: "chat-item-list"},
                chatitem: testChatList()
            }),
            chatFlow: new ChatFlow("ul",{
                message: testMessageList()
            }),
            events:{
                click: Handlers.onChatClick,
                input: Handlers.onInput,
                focusout: Handlers.onItemFocusOut,
                submit: Handlers.onFormSubmit
            } 
        });

        const bus = new EventBus();
        bus.on("chat:change-active", () => {
            this._children.chatItems.setProps({chatitem: testChatList()});
            this._children.chatFlow.setProps({message: testMessageList()});
            this.setProps({
                isActiveChat: getIsActiveChat(),
                chatHeaderImage: getActiveChat()?.image,
                chatHeaderTitle:  getActiveChat()?.name
            });
        });
        bus.on("input:set-invalid", ({value}) => {
            this.setProps({isInvalidClass: "chat-message__input_invalid", value: value});
        });
        bus.on("input:set-valid", ({value}) => {
            this.setProps({isInvalidClass: "", value: value});
        });
        bus.on("chat:message-send", (message) => {
            state.newMessageText = message;
            this._children.chatFlow.setProps({message: updateTestMessageList()});
        });
    }

    render(){
        return this.compile(chatListTemplate, {
            replaces: [
                {profileUrl: this._props.profileUrl},
                {addChatText: this._props.addChatText},
                {removeChatText: this._props.removeChatText},
                {isActiveChat: this._props.isActiveChat},
                {chatHeaderImage: this._props.chatHeaderImage},
                {chatHeaderTitle: this._props.chatHeaderTitle},
                {message_name: this._props.message_name},
                {isInvalidClass: this._props.isInvalidClass},
                {value: this._props.value}
            ]
        });
    }
}

            