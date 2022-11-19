import { Block } from "../../common/block";
import { unknownTemplate } from "../unknown-page/unknownPage.tmpl";

type Page404BlockType = {
  attr: string,
  unknownPageTitle: string,
  unknownPageText: string,
  backLinkText: string,
  backLink: string,
}

export class Page404Block extends Block<Page404BlockType> {
  constructor() {
    super("div", {
      attr: { class: "flexcontainer" },
      unknownPageTitle: "404",
      unknownPageText: "Упс.. Такой страницы нет &#128533;",
      backLinkText: "На главную",
    });
  }

  render() {
    return this.compile(unknownTemplate, {
      replaces: [
        { unknownPageTitle: this._props.unknownPageTitle },
        { unknownPageText: this._props.unknownPageText },
        { backLinkText: this._props.backLinkText },
        { backLink: this._props.backLink },
      ],
    });
  }
}
