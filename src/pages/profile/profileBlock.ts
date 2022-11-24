import { Block } from "../../common/block";
import { state } from "../../common/state";
import { profileTemplate } from "./profile.tmpl";
import { LabledStateInputs } from "../../components/labled-state-inputs/labledStateInputs";
import { Handlers } from "../../common/handlers";
import { EventBus } from "../../common/eventBus";
import { KeyObject, updateActions, profileActions } from "../../common/common";
import { Requests } from "../../common/requests";

type ProfileBlockType = {
  getChangeDataTitle: string,
  profileImage: string,
  profileChangeDataTitle: string,
  submitWaiting: string,
  errorMessage: string,
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
      submitWaiting: "",
      errorMessage: "",
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
            disabled: "",
            checked: "",
          },
          {
            title: "Фамилия",
            value: "",
            id: "second_name",
            type: "text",
            isInvalidClass: "",
            isHidden: "",
            errorMessage: "",
            disabled: "",
            checked: "",
          },
          {
            title: "Логин",
            value: "",
            id: "login",
            type: "text",
            isInvalidClass: "",
            isHidden: "",
            errorMessage: "",
            disabled: "",
            checked: "",
          },
          {
            title: "Имя в чате",
            value: "",
            id: "display_name",
            type: "text",
            isInvalidClass: "",
            isHidden: "",
            errorMessage: "",
            disabled: "",
            checked: "",
          },
          {
            title: "Электронная почта",
            value: "",
            id: "email",
            type: "text",
            isInvalidClass: "",
            isHidden: "",
            errorMessage: "",
            disabled: "",
            checked: "",
          },
          {
            title: "Телефон",
            value: "",
            id: "phone",
            type: "text",
            isInvalidClass: "",
            isHidden: "",
            errorMessage: "",
            disabled: "",
            checked: "",
          },
          {
            title: "Сменить пароль",
            value: "",
            id: "changePass",
            type: "checkbox",
            isInvalidClass: "",
            isHidden: getIsHidden(),
            errorMessage: "",
            disabled: "",
            checked: "",
          },
          {
            title: "Старый пароль",
            value: "",
            id: "oldPassword",
            type: "password",
            isInvalidClass: "",
            isHidden: getIsHidden(),
            errorMessage: "",
            disabled: "disabled",
            checked: "",
          },
          {
            title: "Новый пароль",
            value: "",
            id: "newPassword",
            type: "password",
            isInvalidClass: "",
            isHidden: getIsHidden(),
            errorMessage: "",
            disabled: "disabled",
            checked: "",
          },
          {
            title: "Аватар",
            id: "avatar",
            type: "file",
            isInvalidClass: "",
            isHidden: getIsHidden(),
            errorMessage: "",
            disabled: "",
            checked: "",
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
    bus.on(profileActions.changeMode, () => {
      state.dataChangeMode = !state.dataChangeMode;
      this.setProps({ profileChangeDataTitle: getChangeDataTitle() } as ProfileBlockType);
      const newItemsProps = this._children.labledStateInputs._props.items.map((item: KeyObject) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        (["changePass", "oldPassword", "newPassword", "avatar"].includes(item.id) ? { ...item, isHidden: getIsHidden() } : item));
      this._children.labledStateInputs.setProps({
        dataChangeMode: getChangeMode(),
        isReadOnly: getIsReadOnly(),
        items: newItemsProps,
      });
    });
    bus.on(updateActions.startWaiting, () => {
      this.setProps({ profileTitle: "Загрузка..." } as ProfileBlockType);
    });
    bus.on(updateActions.getData, (updateItems: KeyObject) => {
      this.setProps({
        profileTitle: updateItems.display_name ?? "",
        profileImage: Requests.getAvatarResource(updateItems.avatar),
      } as ProfileBlockType);
      const newItemsProps = this._children.labledStateInputs._props.items.map((item: KeyObject) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        (updateItems[item.id] ? { ...item, value: updateItems[item.id] } : item));
      this._children.labledStateInputs.setProps({ items: newItemsProps });
    });
    bus.on(profileActions.changePassEnable, () => {
      const newItemsProps = this._children.labledStateInputs._props.items.map((item: KeyObject) => {
        if(["oldPassword", "newPassword"].includes(item.id)) {
          return { ...item, disabled: "" };
        }
        if(item.id === "changePass") {
          return ({ ...item, checked: "checked" });
        }
        return item;
      });
      this._children.labledStateInputs.setProps({
        items: newItemsProps,
      });
    });
    bus.on(profileActions.changePassDisable, () => {
      const newItemsProps = this._children.labledStateInputs._props.items.map((item: KeyObject) => {
        if(["oldPassword", "newPassword"].includes(item.id)) {
          return {
            ...item,
            disabled: "disabled",
            value: "",
            errorMessage: "",
            isInvalidClass: "",
          };
        }
        if(item.id === "changePass") {
          return ({ ...item, checked: "" });
        }
        return item;
      });
      this._children.labledStateInputs.setProps({
        items: newItemsProps,
      });
    });
    Requests.profileUpdate();
  }

  render() {
    return this.compile(profileTemplate, {
      replaces: [
        { profileTitle: this._props.profileTitle },
        { profileImage: this._props.profileImage },
        { profileChangeDataTitle: this._props.profileChangeDataTitle },
        { submitWaiting: this._props.submitWaiting },
        { errorMessage: this._props.errorMessage },
        { profileGoBackTitle: this._props.profileGoBackTitle },
        { dataChangeMode: this._props.dataChangeMode },
        { isReadOnly: this._props.isReadOnly },
        { profileChangePasswordTitle: this._props.profileChangePasswordTitle },
        { profileLogoutTitle: this._props.profileLogoutTitle },
      ],
    });
  }
}
