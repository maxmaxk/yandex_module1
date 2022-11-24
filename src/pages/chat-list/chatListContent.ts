import { KeyObject } from "../../common/common";
import { Requests } from "../../common/requests";

type DeliveryStatus = "message-none" | "message-sended" | "message-recieved" | "message-readed";
type MessageType = "date-message" | "companion-message" | "my-message";
type MessageItem = {
    type: MessageType,
    content: string,
    time?: string,
    status?: DeliveryStatus
}
type PersonInfo = {
  [id: number]: string,
}

export class ChatListContent {
  currentUser: KeyObject;

  usersCache: PersonInfo;

  constructor(currentUser: KeyObject) {
    this.currentUser = currentUser;
    this.usersCache = {};
  }

  async updateMessageList(data: KeyObject[]): Promise<MessageItem[]> {
    const updMessageList: MessageItem[] = [];
    let headerDate: string = data[0] ? ChatListContent.parseDate(data[0].time) : "";
    await Promise.all(data.map((item) => this.getUserName(item.user_id)));
    data.forEach((item) => {
      const messageItem = this.getMessageItem(item);
      const messageDate = ChatListContent.parseDate(item.time);
      if (messageDate !== headerDate) {
        updMessageList.unshift({ type: "date-message", content: headerDate });
        headerDate = messageDate;
      }
      updMessageList.unshift(messageItem);
    });
    if(headerDate) updMessageList.unshift({ type: "date-message", content: headerDate });
    return updMessageList;
  }

  getMessageItem(item: KeyObject): MessageItem {
    const userName = this.usersCache[item.user_id] ? `${this.usersCache[item.user_id]} : ` : "";
    const myMessage = this.currentUser.id === item.user_id;
    let messageStatus = item.is_read ? "message-readed" : "message-recieved";
    if(!myMessage) messageStatus = "message-none";
    const messageItem: MessageItem = {
      type: myMessage ? "my-message" : "companion-message",
      content: item.type === "message" ? `${userName}${item.content}` : "<file>",
      time: ChatListContent.parseTime(item.time),
      status: messageStatus as DeliveryStatus,
    };
    return messageItem;
  }

  async getUserName(userId: number) {
    if(this.currentUser.id === userId) return "";
    if(this.usersCache[userId]) return this.usersCache[userId];
    const result = await Requests.getUserById(userId);
    if(result.first_name) {
      this.usersCache[userId] = result.first_name;
      return result.first_name;
    }
    return "";
  }

  static getShortMessage(message: string): string {
    if(!message) return "";
    const maxMessageLength = 20;
    return message.length > maxMessageLength ? `${message.slice(0, maxMessageLength)}...` : message;
  }

  static parseDateTimeToStr(
    dateTime: string | null,
    options: Intl.DateTimeFormatOptions,
    method: Function,
  ): string {
    if(!dateTime) return "";
    const dt = new Date(Date.parse(dateTime));
    return method.call(dt, "ru-RU", options as Intl.DateTimeFormatOptions);
  }

  static parseDateTime(dateTime: string | null): string {
    const options = {
      hour: "numeric", minute: "numeric", year: "numeric", month: "numeric", day: "numeric",
    };
    return ChatListContent.parseDateTimeToStr(
      dateTime,
      options as Intl.DateTimeFormatOptions,
      Date.prototype.toLocaleDateString,
    );
  }

  static parseDate(dateTime: string | null): string {
    const options = {
      year: "numeric", month: "long", day: "numeric",
    };
    return ChatListContent.parseDateTimeToStr(
      dateTime,
      options as Intl.DateTimeFormatOptions,
      Date.prototype.toLocaleDateString,
    );
  }

  static parseTime(dateTime: string | null): string {
    const options = {
      hour: "numeric", minute: "numeric",
    };
    return ChatListContent.parseDateTimeToStr(
      dateTime,
      options as Intl.DateTimeFormatOptions,
      Date.prototype.toLocaleTimeString,
    );
  }
}
