import { Block } from "../../common/block";
import { labledInputsTemplate } from "./labledInputs.tmpl";

type LabledInputsBlockType = {
  items: object
}

export class LabledInputs extends Block<LabledInputsBlockType> {
  render() {
    return this.compile(labledInputsTemplate, {
      loops: [
        { item: this._props.items },
      ],
    });
  }
}
