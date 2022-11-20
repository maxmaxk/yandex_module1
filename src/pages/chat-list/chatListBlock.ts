import { Block } from "../../common/block";
import { state } from "../../common/state";
import { chatListTemplate } from "./chatList.tmpl";
import { pages } from "../pages";
import { updateTestMessageList } from "./chatListContext";
import { ChatItems } from "../../components/chat-items/chatItems";
import { ChatFlow } from "../../components/chat-flow/chatFlow";
import { Handlers } from "../../common/handlers";
import { EventBus } from "../../common/eventBus";
import {
  InputParams,
  chatActions,
  inputActions,
  KeyObject,
} from "../../common/common";
import { Requests } from "../../common/requests";
import { ChatWebSocket } from "../../common/chatwebsocket";

type ChatListBlockType = {
  attr: object,
  profileUrl: string,
  addChatText: string,
  chatAddUserTitle: string,
  chatRemoveUserTitle: string,
  removeChatText: string,
  isActiveChat: string,
  chatHeaderImage: string | undefined,
  chatHeaderTitle: string | undefined,
  message_name: string,
  isInvalidClass: string,
  promptVisible: string,
  promptPlaceholder: string,
  promptId: string,
  value: string,
  errorMessage: string,
  panelErrorMessage: string,
  chatItems: ChatItems,
  chatFlow: ChatFlow,
  events: object,
}

export class ChatListBlock extends Block<ChatListBlockType> {
  _wsocket: ChatWebSocket | null;

  _user: KeyObject;

  constructor() {
    const getActiveChat = () =>
      // eslint-disable-next-line implicit-arrow-linebreak
      state.chatList.filter((item: KeyObject) => item.id === state.activeChatId)[0];
    const getIsActiveChat = (): string => (state.activeChatId < 0 ? "inactive-message" : "active-message");
    super("div", {
      attr: { class: "panelcontainer" },
      profileUrl: pages.profile.url,
      addChatText: "Добавить чат",
      removeChatText: "!",
      chatAddUserTitle: "+",
      chatRemoveUserTitle: "+",
      isActiveChat: getIsActiveChat(),
      chatHeaderImage: getActiveChat()?.image,
      chatHeaderTitle: getActiveChat()?.name,
      message_name: "message",
      isInvalidClass: "",
      promptVisible: "",
      promptPlaceholder: "",
      promptId: "",
      value: "",
      chatItems: new ChatItems("ul", {
        attr: { class: "chat-item-list" },
        chatItem: [],
      }),
      chatFlow: new ChatFlow("ul", {
        attr: { class: "chat-body__message-list" },
        message: [],
      }),
      errorMessage: "",
      panelErrorMessage: "",
      events: {
        click: Handlers.onChatClick,
        input: Handlers.onInput,
        focusout: Handlers.onItemFocusOut,
        submit: Handlers.onFormSubmit,
      },
    });
    const bus = new EventBus();
    bus.on(chatActions.changeActive, () => {
      this.setProps({
        isActiveChat: getIsActiveChat(),
        chatHeaderImage: Requests.getAvatarResource(getActiveChat().avatar),
        chatHeaderTitle: getActiveChat()?.title,
      } as ChatListBlockType);

      const oldItems = [...this._children.chatItems._props.chatItem];
      this._children.chatItems.setProps({
        chatItem: oldItems.map((item: KeyObject) => (
          {
            ...item, isActiveClass: state.activeChatId === item.id ? " active" : "",
          }
        )),
      });
      Requests.getChatToken(state.activeChatId.toString());
    });
    bus.on(
      inputActions.setInvalid,
      ({ value }: InputParams, relatedTarget: HTMLElement, errorMessage: string) => {
        this.setProps({ isInvalidClass: "chat-message__input_invalid", value, errorMessage } as ChatListBlockType);
        // eslint-disable-next-line no-unused-expressions
        relatedTarget;
      },
    );
    bus.on(
      inputActions.setValid,
      ({ value }: InputParams, relatedTarget: HTMLElement, errorMessage: string) => {
        this.setProps({ isInvalidClass: "", value, errorMessage } as ChatListBlockType);
        // eslint-disable-next-line no-unused-expressions
        relatedTarget;
      },
    );
    bus.on(chatActions.messageSend, (message: string) => {
      state.newMessageText = message;
      this.setProps({ isInvalidClass: "", errorMessage: "" } as ChatListBlockType);
      this._children.chatFlow.setProps({ message: updateTestMessageList() });
    });
    bus.on(chatActions.getChatList, (chatList: object[]) => {
      state.chatList = chatList;
      this._children.chatItems.setProps({
        chatItem: chatList.map((item: KeyObject) => (
          {
            id: item.id,
            name: item.title,
            image: Requests.getAvatarResource(item.avatar),
            isActiveClass: "",
            lastMessageOwn: item.last_message?.user.first_name ?? "",
            lastMessage: item.last_message?.content ?? "",
            time: item.last_message?.time ?? "",
            unreadCount: (item.unread_count > 0) ? item.unread_count : "",
          }
        )),
      });
    });
    bus.on(chatActions.addChatPromptOpen, () => {
      this.setProps({ promptVisible: "_visible", promptPlaceholder: "Название нового чата", promptId: "add-chat" } as ChatListBlockType);
    });
    bus.on(chatActions.addUserToChatPromptOpen, () => {
      this.setProps({ promptVisible: "_visible", promptPlaceholder: "Логин юзера", promptId: "add-user-to-chat" } as ChatListBlockType);
    });
    bus.on(chatActions.removeUserFromChatPromptOpen, () => {
      this.setProps({ promptVisible: "_visible", promptPlaceholder: "Логин юзера для удаления", promptId: "remove-user-from-chat" } as ChatListBlockType);
    });
    bus.on(chatActions.addChat, () => {
      Requests.addChat(state.promptInput);
    });
    bus.on(chatActions.addUserToChat, () => {
      Requests.addUserToChat(state.promptInput, state.activeChatId.toString());
    });
    bus.on(chatActions.removeUserFromChat, () => {
      Requests.removeUserFromChat(state.promptInput, state.activeChatId.toString());
    });
    bus.on(chatActions.promptClose, () => {
      this.setProps({ promptVisible: "" } as ChatListBlockType);
    });
    bus.on(chatActions.errorMsg, (errorMsg: string) => {
      this.setProps({ panelErrorMessage: errorMsg } as ChatListBlockType);
    });
    bus.on(chatActions.openSocket, async (token: string) => {
      if(this._wsocket) this._wsocket.close();
      this._wsocket = new ChatWebSocket(this._user.id, state.activeChatId.toString(), token);
    });
    Requests.getChats("");
    Requests.getUser().then((res: KeyObject) => {
      try{
        this._user = JSON.parse(res.response);
      }catch(error) {
        this._user = {};
      }
    });
    this._wsocket = null;
  }

  render() {
    return this.compile(chatListTemplate, {
      replaces: [
        { profileUrl: this._props.profileUrl },
        { addChatText: this._props.addChatText },
        { removeChatText: this._props.removeChatText },
        { chatAddUserTitle: this._props.chatAddUserTitle },
        { chatRemoveUserTitle: this._props.chatRemoveUserTitle },
        { isActiveChat: this._props.isActiveChat },
        { chatHeaderImage: this._props.chatHeaderImage },
        { chatHeaderTitle: this._props.chatHeaderTitle },
        { message_name: this._props.message_name },
        { isInvalidClass: this._props.isInvalidClass },
        { promptVisible: this._props.promptVisible },
        { promptPlaceholder: this._props.promptPlaceholder },
        { promptId: this._props.promptId },
        { value: this._props.value },
        { errorMessage: this._props.errorMessage },
        { panelErrorMessage: this._props.panelErrorMessage },
      ],
    });
  }
}
