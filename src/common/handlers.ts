import { state } from "./state";
import { EventBus } from "./eventBus";
import { Validator } from "./validator";
import { Block } from "./block";
import {
  KeyObject,
  InputParams,
  inputActions,
  profileActions,
  chatActions,
  submitActions,
} from "./common";
import { LoginBlock } from "../pages/login/loginBlock";
import { ProfileBlock } from "../pages/profile/profileBlock";
import { RegistrationBlock } from "../pages/registration/registrationBlock";
import { Router } from "./router";
import { Requests } from "./requests";

export type FormValidateData = {
    [keyName: string]: {
      value: string,
      errorMessage: string,
    }
};

const bus = new EventBus();

export class Handlers {
  static getContainer(element: HTMLElement, containerClass: string): HTMLElement | null {
    while(true) {
      if(!element) return null;
      if(element.className === containerClass) return element;
      element = element.parentElement as HTMLElement;
    }
  }

  // @ts-ignore
  static onItemFocusOut(e) {
    if(((e.target.tagName === "INPUT") && (e.target.type !== "file")) || (e.target.tagName === "TEXTAREA")) {
      if(!e.target.id) return;
      const validator = new Validator(e.target);
      const errorMessage = validator.getErrorMessage();
      const event = errorMessage === "" ? inputActions.setValid : inputActions.setInvalid;
      bus.emit(event, e.target, e.relatedTarget, errorMessage);
    }
  }

  // @ts-ignore
  static onProfileManagment(e) {
    if((e.target.className === "profile__change-data") && !state.dataChangeMode) {
      bus.emit(profileActions.changeMode);
    }
    if(e.target.className === "profile__logout") {
      Requests.logout();
      e.preventDefault();
    }
    if(e.target.className === "profile__go-back") {
      Router.back();
      e.preventDefault();
    }
    if(e.target.name === "changePass") {
      bus.emit(e.target.checked
        ? profileActions.changePassEnable
        : profileActions.changePassDisable);
    }
  }

  // @ts-ignore
  static onChatClick(e) {
    switch (e.target.className) {
      case "top-menu__add-chat":
        bus.emit(chatActions.addChatPromptOpen);
        break;
      case "prompt-panel__add-chat":
        bus.emit(chatActions.addChat);
        bus.emit(chatActions.promptClose);
        break;
      case "prompt-panel__add-user-to-chat":
        bus.emit(chatActions.addUserToChat);
        bus.emit(chatActions.promptClose);
        break;
      case "prompt-panel__remove-user-from-chat":
        bus.emit(chatActions.removeUserFromChat);
        bus.emit(chatActions.promptClose);
        break;
      case "prompt-panel__remove-chat":
        bus.emit(chatActions.removeChat);
        bus.emit(chatActions.promptClose);
        break;
      case "prompt-panel__cancel-button":
        bus.emit(chatActions.promptClose);
        break;
      case "chat-message__addon":
        console.log("add attachment to message event");
        break;
      case "chat-header__add-user":
        bus.emit(chatActions.addUserToChatPromptOpen);
        break;
      case "chat-header__remove-user":
        bus.emit(chatActions.removeUserFromChatPromptOpen);
        break;
      case "chat-header__remove-chat":
        bus.emit(chatActions.removeChatPromptOpen);
        break;
      default:
        const chatContainer = Handlers.getContainer(e.target, "chat-item__container");
        if(chatContainer) {
          state.newMessageText = "";
          const newActiveChatId = parseInt(chatContainer.id, 10);
          if(!Number.isNaN(newActiveChatId)) state.activeChatId = newActiveChatId;
          let chatItemList = document.getElementsByClassName("chat-item-list")[0];
          const { scrollTop } = chatItemList;
          bus.emit(chatActions.changeActive);
          // eslint-disable-next-line prefer-destructuring
          chatItemList = document.getElementsByClassName("chat-item-list")[0];
          chatItemList.scrollTo(0, scrollTop);
        }
    }
  }

  // @ts-ignore
  static onInput(e) {
    if(e.target.className === "search-panel__input") {
      console.log("chat filter change event");
    }
    if(e.target.className === "prompt-panel__input") {
      state.promptInput = e.target.value;
    }
  }

  // @ts-ignore
  static async onFormSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    // @ts-ignore
    const iter = data.keys();
    let isAllValid = true;
    let noPasswordChangeMode = false;
    const formValidateData: FormValidateData = {};
    while(true) {
      const { value, done } = iter.next();
      if(done) break;
      const validator = new Validator(value, data.get(value));
      let errorMessage = validator.getErrorMessage();
      if((e.target.id === "profile-form") && (value === "oldPassword") && (data.get(value) === "")) {
        noPasswordChangeMode = true;
        errorMessage = "";
      }
      if(noPasswordChangeMode && (value === "newPassword")) errorMessage = "";
      const isValid: boolean = errorMessage === "";
      formValidateData[value] = {
        value: data.get(value) as string,
        errorMessage,
      };
      isAllValid &&= isValid;
    }
    if(isAllValid) {
      await Requests.onSubmitRequest(e.target.id, formValidateData);
      if(e.target.id === "profile-form") {
        bus.emit(profileActions.changeMode);
        Requests.profileUpdate();
      }
    }else{
      Object.entries(formValidateData).forEach(([key, value]) => {
        const event = value.errorMessage === "" ? inputActions.setValid : inputActions.setInvalid;
        bus.emit(event, document.getElementById(key), e.target, value.errorMessage);
      });
    }
  }

  static busBind<T extends KeyObject>(block: Block<T>) {
    bus.on(
      inputActions.setInvalid,
      ({ id, value }: InputParams, relatedTarget: HTMLElement, errorMessage: string) => {
        if((block instanceof LoginBlock) || (block instanceof RegistrationBlock)) {
          const newItemsProps = block._children.labledInputs._props.items.map((item: KeyObject) =>
            // eslint-disable-next-line implicit-arrow-linebreak
            (item.id === id ? {
              ...item, value, errorMessage, isInvalidClass: "input-block__input_invalid",
            } : item));
          block._children.labledInputs.setProps({ items: newItemsProps });
        }
        if(block instanceof ProfileBlock) {
          const newItemsProps = block._children.labledStateInputs._props.items
            .map((item: KeyObject) =>
            // eslint-disable-next-line implicit-arrow-linebreak
              (item.id === id ? {
                ...item, value, errorMessage, isInvalidClass: " profile-detail__value_invalid",
              } : item));
          block._children.labledStateInputs.setProps({ items: newItemsProps });
        }
        Block.restoreFocus(relatedTarget);
      },
    );

    bus.on(
      inputActions.setValid,
      ({ id, value }: InputParams, relatedTarget: HTMLElement, errorMessage: string) => {
        if((block instanceof LoginBlock) || (block instanceof RegistrationBlock)) {
          const newItemsProps = block._children.labledInputs._props.items.map((item: KeyObject) =>
            // eslint-disable-next-line implicit-arrow-linebreak
            (item.id === id ? {
              ...item, value, errorMessage, isInvalidClass: "",
            } : item));
          block._children.labledInputs.setProps({ items: newItemsProps });
        }
        if(block instanceof ProfileBlock) {
          const newItemsProps = block._children.labledStateInputs._props.items
            .map((item: KeyObject) =>
              // eslint-disable-next-line implicit-arrow-linebreak
              (item.id === id ? {
                ...item, value, errorMessage, isInvalidClass: "",
              } : item));
          block._children.labledStateInputs.setProps({ items: newItemsProps });
        }
        Block.restoreFocus(relatedTarget);
      },
    );

    bus.on(submitActions.startWaiting, () => {
      block.setProps({ ...block._props, submitWaiting: " form__submit_waiting" });
    });

    bus.on(submitActions.stopWaiting, () => {
      block.setProps({ ...block._props, submitWaiting: "" });
    });

    bus.on(submitActions.error, (msg: string) => {
      block.setProps({ ...block._props, errorMessage: msg });
    });
  }
}
