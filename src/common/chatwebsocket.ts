import { SendMessageData } from "./requests";
import { EventBus } from "./eventBus";
import { chatActions } from "./common";

type ConnectionParams = {
  userId: string,
  chatId: string,
  token: string,
}

export class ChatWebSocket {
  static wsBaseUrl = "wss://ya-praktikum.tech/ws/chats";

  static pingInterval = 5000;

  static __instance: ChatWebSocket;

  _socket: WebSocket | null;

  _connectionParams: ConnectionParams;

  _isActive: boolean;

  _timeoutRef: ReturnType<typeof setTimeout>;

  bus: EventBus;

  constructor(userId?: string, chatId?: string, token?: string) {
    if (ChatWebSocket.__instance) {
      // eslint-disable-next-line no-constructor-return
      return ChatWebSocket.__instance;
    }
    ChatWebSocket.__instance = this;
    this.bus = new EventBus();
    if(!userId || !chatId || !token) throw new Error("Wrong connection parameters");
    this._connectionParams = { userId, chatId, token };
    this.createNewSocket();
  }

  createNewSocket() {
    try {
      const { userId, chatId, token } = this._connectionParams;
      this._socket = new WebSocket(`${ChatWebSocket.wsBaseUrl}/${userId}/${chatId}/${token}`);
      clearTimeout(this._timeoutRef);
      this._socket.addEventListener("open", () => {
        this._isActive = true;
        this.ping();
        this.getOldMessages();
      });
      this._socket.addEventListener("message", (event) => {
        try{
          const data = JSON.parse(event.data);
          if(Array.isArray(data)) {
            this.bus.emit(chatActions.getHistory, data);
          }else if(data.type === "message") {
            this.bus.emit(chatActions.getMessage, data);
          }
        }catch(error) {
          console.log(`error parse ${error.message}}`);
        }
      });
      this._socket.addEventListener("close", (event) => {
        this._isActive = false;
        if (!event.wasClean) {
          console.log("Websocket was terminated");
          this.createNewSocket();
        }
      });
      this._socket.addEventListener("error", () => {
        this._isActive = false;
      });
    }catch(error) {
      console.log(`Can't open webSocket ${error.message}`);
    }
  }

  changeChat(newChatId: string, newToken: string) {
    this.close();
    this._connectionParams.chatId = newChatId;
    this._connectionParams.token = newToken;
    this.createNewSocket();
  }

  close() {
    if(this._socket && this._isActive) {
      this._socket.close();
    }
    this._isActive = false;
  }

  ping() {
    if(this._socket && this._isActive) {
      this._socket.send(JSON.stringify({ type: "ping" }));
      this._timeoutRef = setTimeout(this.ping.bind(this), ChatWebSocket.pingInterval);
    }
  }

  getOldMessages() {
    if(this._socket && this._isActive) {
      this._socket.send(JSON.stringify({
        content: "0",
        type: "get old",
      }));
    }
  }

  sendMessage(sendMessageData: SendMessageData) {
    if(this._socket && this._isActive) {
      this._socket.send(JSON.stringify({
        content: sendMessageData.message.value,
        type: "message",
      }));
    }
  }
}
