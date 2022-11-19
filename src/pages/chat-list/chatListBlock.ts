import { Block } from "../../common/block";
import { state } from "../../common/state";
import { chatListTemplate } from "./chatList.tmpl";
import { pages } from "../pages";
import { testChatList, testMessageList, updateTestMessageList } from "./chatListContext";
import { ChatItems } from "../../components/chat-items/chatItems";
import { ChatFlow } from "../../components/chat-flow/chatFlow";
import { Handlers } from "../../common/handlers";
import { EventBus } from "../../common/eventBus";
import { InputParams } from "../../common/commonTypes";

type ChatListBlockType = {
  attr: object,
  profileUrl: string,
  addChatText: string,
  removeChatText: string,
  isActiveChat: string,
  chatHeaderImage: string | undefined,
  chatHeaderTitle: string | undefined,
  message_name: string,
  isInvalidClass: string,
  value: string,
  errorMessage: string,
  chatItems: ChatItems,
  chatFlow: ChatFlow,
  events: object,
}

export class ChatListBlock extends Block<ChatListBlockType> {
  constructor() {
    const getActiveChat = () => testChatList()[state.activeChatId];
    const getIsActiveChat = (): string => (state.activeChatId < 0 ? "inactive-message" : "active-message");
    super("div", {
      attr: { class: "panelcontainer" },
      profileUrl: pages.profile.url,
      addChatText: "Добавить чат",
      removeChatText: "УДАЛИТЬ ЧАТ",
      isActiveChat: getIsActiveChat(),
      chatHeaderImage: getActiveChat()?.image,
      chatHeaderTitle: getActiveChat()?.name,
      message_name: "message",
      isInvalidClass: "",
      value: "",
      chatItems: new ChatItems("ul", {
        attr: { class: "chat-item-list" },
        chatitem: testChatList(),
      }),
      chatFlow: new ChatFlow("ul", {
        attr: { class: "chat-body__message-list" },
        message: testMessageList(),
      }),
      errorMessage: "",
      events: {
        click: Handlers.onChatClick,
        input: Handlers.onInput,
        focusout: Handlers.onItemFocusOut,
        submit: Handlers.onFormSubmit,
      },
    });
    const bus = new EventBus();
    bus.on("chat:change-active", () => {
      this._children.chatItems.setProps({ chatitem: testChatList() });
      this._children.chatFlow.setProps({ message: testMessageList() });
      this.setProps({
        isActiveChat: getIsActiveChat(),
        chatHeaderImage: getActiveChat()?.image,
        chatHeaderTitle: getActiveChat()?.name,
      } as ChatListBlockType);
    });
    bus.on("input:set-invalid", ({ value }: InputParams, relatedTarget: HTMLElement, errorMessage: string) => {
      this.setProps({ isInvalidClass: "chat-message__input_invalid", value, errorMessage } as ChatListBlockType);
      // eslint-disable-next-line no-unused-expressions
      relatedTarget;
    });
    bus.on("input:set-valid", ({ value }: InputParams, relatedTarget: HTMLElement, errorMessage: string) => {
      this.setProps({ isInvalidClass: "", value, errorMessage } as ChatListBlockType);
      // eslint-disable-next-line no-unused-expressions
      relatedTarget;
    });
    bus.on("chat:message-send", (message: string) => {
      state.newMessageText = message;
      this.setProps({ isInvalidClass: "", errorMessage: "" } as ChatListBlockType);
      this._children.chatFlow.setProps({ message: updateTestMessageList() });
    });
  }

  render() {
    return this.compile(chatListTemplate, {
      replaces: [
        { profileUrl: this._props.profileUrl },
        { addChatText: this._props.addChatText },
        { removeChatText: this._props.removeChatText },
        { isActiveChat: this._props.isActiveChat },
        { chatHeaderImage: this._props.chatHeaderImage },
        { chatHeaderTitle: this._props.chatHeaderTitle },
        { message_name: this._props.message_name },
        { isInvalidClass: this._props.isInvalidClass },
        { value: this._props.value },
        { errorMessage: this._props.errorMessage },
      ],
    });
  }
}
