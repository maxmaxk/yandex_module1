import { Block } from "../../common/block";
import { loginTemplate } from "./login.tmpl";
import { LabledInputs } from "../../components/labled-inputs/labledInputs";
import { Handlers } from "../../common/handlers";
import { pages } from "../pages";
import { EventBus } from "../../common/eventBus";
import { KeyObject, InputParams } from "../../common/commonTypes";

export class LoginBlock extends Block {
  constructor() {
    super("div", {
      attr: { class: "flexcontainer" },
      loginTitle: "Авторизация",
      submitTitle: "Вход",
      registrationTitle: "Создать профиль",
      registrationUrl: pages.registration,
      labledInputs: new LabledInputs("ul", {
        attr: { class: "form__input-blocks" },
        items: [
          {
            title: "Имя пользователя",
            id: "login",
            type: "text",
            isInvalidClass: "",
            value: "",
          },
          {
            title: "Пароль",
            id: "password",
            type: "password",
            isInvalidClass: "",
            value: "",
          },
        ],
        events: {
          focusout: Handlers.onItemFocusOut,
        },
      }),
      events: {
        submit: Handlers.onFormSubmit,
      },
    });
    const bus = new EventBus();
    bus.on("input:set-invalid", ({ id, value }: InputParams, relatedTarget: HTMLElement) => {
      const newItemsProps = this._children.labledInputs._props.items.map((item: KeyObject) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        (item.id === id ? { ...item, value, isInvalidClass: "input-block__input_invalid" } : item));
      this._children.labledInputs.setProps({ items: newItemsProps });
      Block.restoreFocus(relatedTarget);
    });
    bus.on("input:set-valid", ({ id, value }: InputParams, relatedTarget: HTMLElement) => {
      const newItemsProps = this._children.labledInputs._props.items.map((item: KeyObject) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        (item.id === id ? { ...item, value, isInvalidClass: "" } : item));
      this._children.labledInputs.setProps({ items: newItemsProps });
      Block.restoreFocus(relatedTarget);
    });
  }

  render() {
    return this.compile(loginTemplate, {
      replaces: [
        { loginTitle: this._props.loginTitle },
        { submitTitle: this._props.submitTitle },
        { registrationTitle: this._props.registrationTitle },
        { registrationUrl: this._props.registrationUrl },
      ],
    });
  }
}
