import { Block } from "../../common/block";
import { chatItemsTemplate } from "./chatItems.tmpl";

export type ChatItemsType = {
  chatitem: object,
}

export class ChatItems extends Block<ChatItemsType> {
  render() {
    return this.compile(chatItemsTemplate, {
      loops: [
        { chatitem: this._props.chatitem },
      ],
    });
  }
}
