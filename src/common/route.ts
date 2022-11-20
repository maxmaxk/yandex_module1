import { Block } from "./block";
import { KeyObject } from "./common";

type RootQuery = {
  rootQuery: string,
}

export class Route {
  _pathname: string;

  _blockClass: typeof Block;

  _block: Block<KeyObject> | null;

  _props: RootQuery;

  constructor(pathname: string, view: typeof Block, props: RootQuery) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  match(pathname: string) {
    return pathname === this._pathname;
  }

  render() {
    if (!this._block) {
      this._block = new this._blockClass();
    }
    const root = document.querySelector(this._props.rootQuery);
    if(root && this._block) {
      root.innerHTML = "";
      root.appendChild(this._block.getContent() as Node);
    }
  }
}
