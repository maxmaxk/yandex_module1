import { Block } from "../../common/block";
import { registrationTemplate } from "./registration.tmpl";
import { LabledInputs } from "../../components/labled-inputs/labledInputs";
import { Handlers } from "../../common/handlers";

type RegistrationBlockType = {
  attr: object,
  registrationTitle: string,
  submitTitle: string,
  submitWaiting: string,
  errorMessage: string,
  labledInputs: LabledInputs,
  events: Object
}

export class RegistrationBlock extends Block<RegistrationBlockType> {
  constructor() {
    super("div", {
      attr: { class: "flexcontainer" },
      registrationTitle: "Регистрация",
      submitTitle: "Зарегистрироваться",
      submitWaiting: "",
      errorMessage: "",
      labledInputs: new LabledInputs("ul", {
        attr: { class: "form__input-blocks" },
        items: [
          {
            title: "Имя",
            id: "first_name",
            type: "text",
            isInvalidClass: "",
            value: "",
            errorMessage: "",
          },
          {
            title: "Фамилия",
            id: "second_name",
            type: "text",
            isInvalidClass: "",
            value: "",
            errorMessage: "",
          },
          {
            title: "Логин",
            id: "login",
            type: "text",
            isInvalidClass: "",
            value: "",
            errorMessage: "",
          },
          {
            title: "Электронная почта",
            id: "email",
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
          {
            title: "Телефон",
            id: "phone",
            type: "text",
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
    return this.compile(registrationTemplate, {
      replaces: [
        { registrationTitle: this._props.registrationTitle },
        { submitTitle: this._props.submitTitle },
        { submitWaiting: this._props.submitWaiting },
        { errorMessage: this._props.errorMessage },
      ],
    });
  }
}
