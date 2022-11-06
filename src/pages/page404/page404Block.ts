import { Block } from "../../common/block";
import { unknownTemplate } from "../unknown-page/unknownPage.tmpl";
import { pages } from "../pages";

export class Page404Block extends Block {
  constructor() {
    super("div", {
      attr: { class: "flexcontainer" },
      unknownPageTitle: "404",
      unknownPageText: "Упс.. Такой страницы нет &#128533;",
      backLinkText: "Назад к чатам",
      backLink: pages.chartList.url,
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
