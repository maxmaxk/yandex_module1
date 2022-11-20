export class ChatWebSocket {
  static wsBaseUrl = "wss://ya-praktikum.tech/ws/chats";

  _socket: WebSocket;

  _isActive: boolean;

  constructor(userId: string, chatId: string, token: string) {
    this._socket = new WebSocket(`${ChatWebSocket.wsBaseUrl}/${userId}/${chatId}/${token}`);
    this._socket.addEventListener("open", () => {
      console.log("Websocket was opened");
      this._isActive = true;
    });
    this._socket.addEventListener("close", () => {
      this._isActive = false;
    });
    this._socket.addEventListener("error", () => {
      this._isActive = false;
    });
    /* TODO Implement messages send/respond method */
  }

  close() {
    if(this._isActive) {
      this._socket.close();
      console.log("Websocket was closed");
    }
    this._isActive = false;
  }
}
