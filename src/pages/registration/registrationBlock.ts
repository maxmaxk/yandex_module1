import { Block } from "../../common/block";
import { registrationTemplate } from "./registration.tmpl";
import { LabledInputs } from "../../components/labled-inputs/labledInputs";
import { Handlers } from "../../common/handlers";
import { EventBus } from "../../common/eventBus";
import { KeyObject, InputParams } from "../../common/commonTypes";

export class RegistrationBlock extends Block {
  constructor() {
    super("div", {
      attr: { class: "flexcontainer" },
      registrationTitle: "Регистрация",
      submitTitle: "Зарегистрироваться",
      labledInputs: new LabledInputs("ul", {
        attr: { class: "form__input-blocks" },
        items: [
          {
            title: "Имя",
            id: "first_name",
            type: "text",
            isInvalidClass: "",
            value: "",
          },
          {
            title: "Фамилия",
            id: "second_name",
            type: "text",
            isInvalidClass: "",
            value: "",
          },
          {
            title: "Логин",
            id: "login",
            type: "text",
            isInvalidClass: "",
            value: "",
          },
          {
            title: "Электронная почта",
            id: "email",
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
          {
            title: "Телефон",
            id: "phone",
            type: "text",
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
    return this.compile(registrationTemplate, {
      replaces: [
        { registrationTitle: this._props.registrationTitle },
        { submitTitle: this._props.submitTitle },
      ],
    });
  }
}
