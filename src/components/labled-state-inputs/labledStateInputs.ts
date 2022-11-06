import { Block } from "../../common/block";
import { labledStateInputsTemplate } from "./labledStateInputs.tmpl";

export class LabledStateInputs extends Block {
  render() {
    return this.compile(labledStateInputsTemplate, {
      replaces: [
        { dataChangeMode: this._props.dataChangeMode },
        { isReadOnly: this._props.isReadOnly },
      ],
      loops: [
        { item: this._props.items },
      ],
    });
  }
}
