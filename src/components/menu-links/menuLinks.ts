import { Block } from "../../common/block";
import { menuLinksTemplate } from "./menuLinks.tmpl";

type MenuLinksType = {
  items: object,
}

export class MenuLinks extends Block<MenuLinksType> {
  render() {
    return this.compile(menuLinksTemplate, {
      loops: [
        { item: this._props.items },
      ],
    });
  }
}
