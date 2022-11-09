import { Block } from "../../common/block";
import { unknownTemplate } from "../unknown-page/unknownPage.tmpl";
import { pages } from "../pages";

type Page500BlockType = {
  attr: string,
  unknownPageTitle: string,
  unknownPageText: string,
  backLinkText: string,
  backLink: string,
}

export class Page500Block extends Block<Page500BlockType> {
  constructor() {
    super("div", {
      attr: { class: "flexcontainer" },
      unknownPageTitle: "500",
      unknownPageText: "Ой.. У нас что-то сломалось &#128551; Мы постараемся починить",
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
