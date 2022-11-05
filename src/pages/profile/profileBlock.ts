import { Block } from "../../common/block";
import { state } from "../../common/state";
import { profileTemplate } from "./profile.tmpl";
import { LabledStateInputs } from "../../components/labled-state-inputs/labledStateInputs";
import { Handlers } from "../../common/handlers";
import { EventBus } from "../../common/eventBus";

export class ProfileBlock extends Block{
    constructor(){
        const getChangeDataTitle = (): string => {
            return state.dataChangeMode ? "Сохранить данные" : "Изменить данные";
        }
        const getChangeMode = (): string => {
            return state.dataChangeMode ? "" : " no-change-mode";
        }
        const getIsReadOnly = (): string => {
            return state.dataChangeMode ? "" : "readonly";
        }
        const getIsHidden = (): string => {
            return state.dataChangeMode ? "" : " hidden"
        }
        super("div", {
            attr: {class: "profile"}, 
            profileTitle: "Князь Мышкин",
            profileImage: "./resources/25.jpg",
            profileChangeDataTitle: getChangeDataTitle(),
            profileChangePasswordTitle: "Изменить пароль",
            profileLogoutTitle: "Выйти",
            labledStateInputs: new LabledStateInputs("ul", {
                attr: {class: "profile__details"},
                dataChangeMode: getChangeMode(),
                isReadOnly: getIsReadOnly(),
                items: [
                    {
                        title: "Имя",
                        value: "Князь",
                        id: "first_name",
                        type: "text",
                        isInvalidClass: "",
                        isHidden: ""
                    },
                    {
                        title: "Фамилия",
                        value: "Мышкин",
                        id: "second_name",
                        type: "text",
                        isInvalidClass: "",
                        isHidden: ""
                    },
                    {
                        title: "Логин",
                        value: "batman",
                        id: "login",
                        type: "text",
                        isInvalidClass: "",
                        isHidden: ""
                    },
                    {
                        title: "Имя в чате",
                        value: "little_mouse",
                        id: "display_name",
                        type: "text",
                        isInvalidClass: "",
                        isHidden: ""
                    },
                    {
                        title: "Электронная почта",
                        value: "batman@hollywood.com",
                        id: "email",
                        type: "text",
                        isInvalidClass: "",
                        isHidden: ""
                    },
                    {
                        title: "Телефон",
                        value: "+1911911911",
                        id: "phone",
                        type: "text",
                        isInvalidClass: "",
                        isHidden: ""
                    },
                    {
                        title: "Старый пароль",
                        value: "",
                        id: "oldPassword",
                        type: "password",
                        isInvalidClass: "",
                        isHidden: getIsHidden()
                    },
                    {
                        title: "Новый пароль",
                        value: "",
                        id: "newPassword",
                        type: "password",
                        isInvalidClass: "",
                        isHidden: getIsHidden()
                    },
                    {
                        title: "Аватар",
                        value: "",
                        id: "avatar",
                        type: "text",
                        isInvalidClass: "",
                        isHidden: getIsHidden()
                    }
                ],
                events: {
                    focusout: Handlers.onItemFocusOut,
                }
            }),
            events:{
                click: Handlers.onProfileManagment,
                submit: Handlers.onFormSubmit
            } 
        });

        const bus = new EventBus();
        bus.on("input:set-invalid", ({id, value}, relatedTarget) => {
            const newItemsProps =  this._children.labledStateInputs._props.items.map(item => {
                return item.id === id ? {...item, value: value, isInvalidClass: " profile-detail__value_invalid"} : item;
            });
            this._children.labledStateInputs.setProps({items: newItemsProps});
            this.restoreFocus(relatedTarget);
        });

        bus.on("input:set-valid", ({id, value}, relatedTarget) => {
            const newItemsProps =  this._children.labledStateInputs._props.items.map(item => {
                return item.id === id ? {...item, value: value, isInvalidClass: ""} : item;
            });
            this._children.labledStateInputs.setProps({items: newItemsProps});
            this.restoreFocus(relatedTarget);
        });

        bus.on("profile:change-mode", () => {
            state.dataChangeMode = !state.dataChangeMode;
            this.setProps({profileChangeDataTitle: getChangeDataTitle()});
            const newItemsProps =  this._children.labledStateInputs._props.items.map(item => {
                return ["oldPassword", "newPassword", "avatar"].includes(item.id) ? {...item, isHidden: getIsHidden()} : item;
            });
            this._children.labledStateInputs.setProps({
                dataChangeMode: getChangeMode(),
                isReadOnly: getIsReadOnly(),
                items: newItemsProps
            });
        });
    }

    render(){
        return this.compile(profileTemplate, {
            replaces: [
                {profileTitle: this._props.profileTitle},
                {profileImage: this._props.profileImage},
                {profileChangeDataTitle: this._props.profileChangeDataTitle},
                {dataChangeMode: this._props.dataChangeMode},
                {isReadOnly: this._props.isReadOnly},
                {profileChangePasswordTitle: this._props.profileChangePasswordTitle},
                {profileLogoutTitle: this._props.profileLogoutTitle},
            ]
        });
    }
}

            