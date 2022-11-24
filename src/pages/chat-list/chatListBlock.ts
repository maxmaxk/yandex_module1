import { Block } from "../../common/block";
import { state } from "../../common/state";
import { chatListTemplate } from "./chatList.tmpl";
import { pages } from "../pages";
import { ChatListContent } from "./chatListContent";
import { ChatItems } from "../../components/chat-items/chatItems";
import { ChatFlow } from "../../components/chat-flow/chatFlow";
import { Handlers } from "../../common/handlers";
import { EventBus } from "../../common/eventBus";
import {
  InputParams,
  chatActions,
  inputActions,
  submitActions,
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
  submitWaiting: string,
  chatItems: ChatItems,
  chatFlow: ChatFlow,
  events: object,
}

export class ChatListBlock extends Block<ChatListBlockType> {
  _wsocket: ChatWebSocket | null;

  _user: KeyObject;

  chatListContent: ChatListContent;

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
      submitWaiting: "",
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
      bus.emit(chatActions.highlightActive);
      Requests.getChatToken(state.activeChatId.toString());
    });
    bus.on(chatActions.highlightActive, () => {
      const oldItems = [...this._children.chatItems._props.chatItem];
      this._children.chatItems.setProps({
        chatItem: oldItems.map((item: KeyObject) => (
          {
            ...item, isActiveClass: state.activeChatId === item.id ? " active" : "",
          }
        )),
      });
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
        Block.restoreFocus(relatedTarget);
      },
    );
    bus.on(chatActions.getMessage, async (data: KeyObject) => {
      const myMessage = this._user.id === data.user_id;
      if (myMessage) this.setProps({ isInvalidClass: "", errorMessage: "", value: "" } as ChatListBlockType);
      this._children.chatFlow.setProps({
        message: [...this._children.chatFlow._props.message,
          this.chatListContent.getMessageItem(data),
        ],
      });
      await Requests.getChats("");
      bus.emit(chatActions.highlightActive);
      bus.emit(chatActions.scrollDown);
    });
    bus.on(chatActions.getHistory, async (data: KeyObject[]) => {
      const messageHistory = await this.chatListContent.updateMessageList(data);
      this._children.chatFlow.setProps(
        { message: messageHistory },
      );
      bus.emit(chatActions.scrollDown);
    });
    bus.on(chatActions.scrollDown, () => {
      const chatBody = document.getElementsByClassName("chat-body__container")[0];
      chatBody.scrollTo(0, chatBody.scrollHeight);
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
            lastMessage: ChatListContent.getShortMessage(item.last_message?.content),
            time: ChatListContent.parseDateTime(item.last_message?.time),
            unreadCount: (item.unread_count > 0) ? item.unread_count : "",
          }
        )),
      });
      bus.emit(chatActions.scrollDown);
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
    bus.on(chatActions.removeChatPromptOpen, () => {
      this.setProps({ promptVisible: "_visible", promptPlaceholder: "Удалить чат?", promptId: "remove-chat" } as ChatListBlockType);
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
    bus.on(chatActions.removeChat, async () => {
      await Requests.removeChat(state.activeChatId.toString());
      state.activeChatId = -1;
      this.setProps({
        isActiveChat: getIsActiveChat(),
      } as ChatListBlockType);
      Requests.getChats("");
    });
    bus.on(chatActions.promptClose, () => {
      this.setProps({ promptVisible: "" } as ChatListBlockType);
    });
    bus.on(chatActions.errorMsg, (errorMsg: string) => {
      this.setProps({ panelErrorMessage: errorMsg } as ChatListBlockType);
    });
    bus.on(chatActions.openSocket, async (token: string) => {
      if(this._wsocket) {
        this._wsocket.changeChat(state.activeChatId.toString(), token);
      }else{
        this._wsocket = new ChatWebSocket(this._user.id, state.activeChatId.toString(), token);
      }
    });
    bus.on(submitActions.error, (errorMessage: string) => {
      this.setProps({ errorMessage } as ChatListBlockType);
    });
    bus.on(submitActions.startWaiting, () => {
      this.setProps({ submitWaiting: " chat-message__sendbtn_waiting" } as ChatListBlockType);
    });
    bus.on(submitActions.stopWaiting, () => {
      this.setProps({ submitWaiting: "" } as ChatListBlockType);
    });
    Requests.getChats("");
    Requests.getUser().then((res: KeyObject) => {
      try{
        this._user = JSON.parse(res.response);
        this.chatListContent = new ChatListContent(this._user);
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
        { submitWaiting: this._props.submitWaiting },
        { errorMessage: this._props.errorMessage },
        { panelErrorMessage: this._props.panelErrorMessage },
      ],
    });
  }
}
