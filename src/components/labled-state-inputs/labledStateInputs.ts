import { Block } from "../../common/block";
import { labledStateInputsTemplate } from "./labledStateInputs.tmpl";

type LabledStateInputsType = {
  dataChangeMode: boolean,
  isReadOnly: boolean,
  items: object,
}

export class LabledStateInputs extends Block<LabledStateInputsType> {
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
