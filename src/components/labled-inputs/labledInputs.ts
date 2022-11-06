import { Block } from "../../common/block";
import { labledInputsTemplate } from "./labledInputs.tmpl";

export class LabledInputs extends Block {
  render() {
    return this.compile(labledInputsTemplate, {
      loops: [
        { item: this._props.items },
      ],
    });
  }
}
