import { Block } from "../../common/block";
import { loginTemplate } from "./login.tmpl";
import { LabledInputs } from "../../components/labled-inputs/labledInputs";
import { Handlers } from "../../common/handlers";
import { pages } from "../pages";

type LoginBlockType = {
  attr: object,
  loginTitle: string,
  submitTitle: string,
  registrationTitle: string,
  registrationUrl: string,
  labledInputs: LabledInputs
}

export class LoginBlock extends Block<LoginBlockType> {
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
            errorMessage: "",
          },
          {
            title: "Пароль",
            id: "password",
            type: "password",
            isInvalidClass: "",
            value: "",
            errorMessage: "",
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
    Handlers.busBind(this);
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
