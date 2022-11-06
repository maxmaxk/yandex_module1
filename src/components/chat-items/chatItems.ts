import { Block } from "../../common/block";
import { chatItemsTemplate } from "./chatItems.tmpl";

export class ChatItems extends Block {
  render() {
    return this.compile(chatItemsTemplate, {
      loops: [
        { chatitem: this._props.chatitem },
      ],
    });
  }
}
