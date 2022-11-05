import { Block } from "../../common/block";
import { chatFlowTemplate } from "./chatFlow.tmpl";

export class ChatFlow extends Block{
    render(){
        return this.compile(chatFlowTemplate, {
            loops: [
                {message: this._props.message}
            ]
        });
    }
}