import { Block } from "../../common/block";
import { menuLinksTemplate } from "./menuLinks.tmpl";

export class MenuLinks extends Block {
  render() {
    return this.compile(menuLinksTemplate, {
      loops: [
        { item: this._props.items },
      ],
    });
  }
}
