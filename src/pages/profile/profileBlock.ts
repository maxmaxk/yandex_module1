import { Block } from "../../common/block";
import { state } from "../../common/state";
import { profileTemplate } from "./profile.tmpl";
import { LabledStateInputs } from "../../components/labled-state-inputs/labledStateInputs";
import { Handlers } from "../../common/handlers";
import { EventBus } from "../../common/eventBus";
import { KeyObject } from "../../common/commonTypes";
import { Requests } from "../../common/requests";

type ProfileBlockType = {
  getChangeDataTitle: string,
  profileImage: string,
  profileChangeDataTitle: string,
  profileGoBackTitle: string,
  profileChangePasswordTitle: string,
  labledStateInputs: LabledStateInputs,
  profileTitle: string,
  dataChangeMode: boolean,
  isReadOnly: boolean,
  profileLogoutTitle: string,
}

export class ProfileBlock extends Block<ProfileBlockType> {
  constructor() {
    const getChangeDataTitle = (): string => (state.dataChangeMode ? "Сохранить данные" : "Изменить данные");
    const getChangeMode = (): string => (state.dataChangeMode ? "" : " no-change-mode");
    const getIsReadOnly = (): string => (state.dataChangeMode ? "" : "readonly");
    const getIsHidden = (): string => (state.dataChangeMode ? "" : " hidden");
    super("div", {
      attr: { class: "profile" },
      profileTitle: "",
      profileImage: "",
      profileChangeDataTitle: getChangeDataTitle(),
      profileChangePasswordTitle: "Изменить пароль",
      profileGoBackTitle: "Назад",
      profileLogoutTitle: "Выйти",
      labledStateInputs: new LabledStateInputs("ul", {
        attr: { class: "profile__details" },
        dataChangeMode: getChangeMode(),
        isReadOnly: getIsReadOnly(),
        items: [
          {
            title: "Имя",
            value: "",
            id: "first_name",
            type: "text",
            isInvalidClass: "",
            isHidden: "",
            errorMessage: "",
          },
          {
            title: "Фамилия",
            value: "",
            id: "second_name",
            type: "text",
            isInvalidClass: "",
            isHidden: "",
            errorMessage: "",
          },
          {
            title: "Логин",
            value: "",
            id: "login",
            type: "text",
            isInvalidClass: "",
            isHidden: "",
            errorMessage: "",
          },
          {
            title: "Имя в чате",
            value: "",
            id: "display_name",
            type: "text",
            isInvalidClass: "",
            isHidden: "",
            errorMessage: "",
          },
          {
            title: "Электронная почта",
            value: "",
            id: "email",
            type: "text",
            isInvalidClass: "",
            isHidden: "",
            errorMessage: "",
          },
          {
            title: "Телефон",
            value: "",
            id: "phone",
            type: "text",
            isInvalidClass: "",
            isHidden: "",
            errorMessage: "",
          },
          {
            title: "Старый пароль",
            value: "",
            id: "oldPassword",
            type: "password",
            isInvalidClass: "",
            isHidden: getIsHidden(),
            errorMessage: "",
          },
          {
            title: "Новый пароль",
            value: "",
            id: "newPassword",
            type: "password",
            isInvalidClass: "",
            isHidden: getIsHidden(),
            errorMessage: "",
          },
          {
            title: "Аватар",
            value: "",
            id: "avatar",
            type: "text",
            isInvalidClass: "",
            isHidden: getIsHidden(),
            errorMessage: "",
          },
        ],
        events: {
          focusout: Handlers.onItemFocusOut,
        },
      }),
      events: {
        click: Handlers.onProfileManagment,
        submit: Handlers.onFormSubmit,
      },
    });

    const bus = new EventBus();
    Handlers.busBind(this);
    bus.on("profile:change-mode", () => {
      state.dataChangeMode = !state.dataChangeMode;
      this.setProps({ profileChangeDataTitle: getChangeDataTitle() } as ProfileBlockType);
      const newItemsProps = this._children.labledStateInputs._props.items.map((item: KeyObject) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        (["oldPassword", "newPassword", "avatar"].includes(item.id) ? { ...item, isHidden: getIsHidden() } : item));
      this._children.labledStateInputs.setProps({
        dataChangeMode: getChangeMode(),
        isReadOnly: getIsReadOnly(),
        items: newItemsProps,
      });
    });
    bus.on("update:start-waiting", () => {
      this.setProps({ profileTitle: "Загрузка..." } as ProfileBlockType);
    });
    bus.on("update:stop-waiting", () => {
      this.setProps({ profileTitle: "Готово" } as ProfileBlockType);
    });
    Requests.profileUpdate();
  }

  render() {
    return this.compile(profileTemplate, {
      replaces: [
        { profileTitle: this._props.profileTitle },
        { profileImage: this._props.profileImage },
        { profileChangeDataTitle: this._props.profileChangeDataTitle },
        { profileGoBackTitle: this._props.profileGoBackTitle },
        { dataChangeMode: this._props.dataChangeMode },
        { isReadOnly: this._props.isReadOnly },
        { profileChangePasswordTitle: this._props.profileChangePasswordTitle },
        { profileLogoutTitle: this._props.profileLogoutTitle },
      ],
    });
  }
}
