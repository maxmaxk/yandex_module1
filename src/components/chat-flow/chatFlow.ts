import { Block } from "../../common/block";
import { chatFlowTemplate } from "./chatFlow.tmpl";

type ChatFlowType = {
  message: string,
}

export class ChatFlow extends Block<ChatFlowType> {
  render() {
    return this.compile(chatFlowTemplate, {
      loops: [
        { message: this._props.message },
      ],
    });
  }
}
