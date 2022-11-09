import { state } from "./state";
import { EventBus } from "./eventBus";
import { Validator } from "./validator";
import { Block } from "./block";
import { KeyObject, InputParams } from "./commonTypes";
import { LoginBlock } from "../pages/login/loginBlock";
import { ProfileBlock } from "../pages/profile/profileBlock";
import { RegistrationBlock } from "../pages/registration/registrationBlock";

type FormValidateData = {
    keyName: string,
    value: string,
    errorMessage: string,
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
    if(e.relatedTarget?.tagName === "BUTTON") return;
    if((e.target.tagName === "INPUT") || (e.target.tagName === "TEXTAREA")) {
      const validator = new Validator(e.target);
      const errorMessage = validator.getErrorMessage();
      const event = errorMessage === "" ? "input:set-valid" : "input:set-invalid";
      bus.emit(event, e.target, e.relatedTarget, errorMessage);
    }
  }

  // @ts-ignore
  static onProfileManagment(e) {
    if((e.target.className === "profile__change-data") && !state.dataChangeMode) {
      bus.emit("profile:change-mode");
      e.preventDefault();
    }
    if(e.target.className === "profile__logout") {
      /**
      * TODO fetch logout request
      */
      console.log("logout request");
      e.preventDefault();
    }
  }

  // @ts-ignore
  static onChatClick(e) {
    switch (e.target.className) {
      case "top-menu__add-chat":
        console.log("add new chat event");
        break;
      case "chat-message__addon":
        console.log("add attachment to message event");
        break;
      default:
        const chatContainer = Handlers.getContainer(e.target, "chat-item__container");
        if(chatContainer) {
          state.newMessageText = "";
          const newActiveChatId = parseInt(chatContainer.id.slice(8), 10);
          if(!Number.isNaN(newActiveChatId)) state.activeChatId = newActiveChatId;
          let chatItemList = document.getElementsByClassName("chat-item-list")[0];
          const { scrollTop } = chatItemList;
          bus.emit("chat:change-active");
          // eslint-disable-next-line prefer-destructuring
          chatItemList = document.getElementsByClassName("chat-item-list")[0];
          chatItemList.scrollTo(0, scrollTop);
        }
        const removeChatContainer = Handlers.getContainer(e.target, "chat-header__remover");
        if(removeChatContainer) {
          console.log("remove chat event");
        }
    }
  }

  // @ts-ignore
  static onInput(e) {
    if(e.target.className === "search-panel__input") {
      console.log("chat filter change event");
    }
  }

  // @ts-ignore
  static onFormSubmit(e) {
    const data = new FormData(e.target);
    // @ts-ignore
    const iter = data.keys();
    let isAllValid = true;
    const formValidateData: FormValidateData[] = [];
    while(true) {
      const { value, done } = iter.next();
      if(done) break;
      const validator = new Validator(value, data.get(value));
      const errorMessage = validator.getErrorMessage();
      const isValid: boolean = errorMessage === "";
      formValidateData.push({
        keyName: value,
        value: data.get(value) as string,
        errorMessage,
      });
      isAllValid &&= isValid;
    }
    if(isAllValid) {
      /**
      * TODO fetch form request
      */
      console.log("form request: ", formValidateData);
      if(e.target.id === "profile-form") bus.emit("profile:change-mode");
      if(e.target.id === "chat-message-form") bus.emit("chat:message-send", formValidateData[0].value);
    }else{
      formValidateData.forEach((item) => {
        const event = item.errorMessage === "" ? "input:set-valid" : "input:set-invalid";
        bus.emit(event, document.getElementById(item.keyName), e.target, item.errorMessage);
      });
    }
    e.preventDefault();
  }

  static busBind<T extends KeyObject>(block: Block<T>) {
    bus.on("input:set-invalid", ({ id, value }: InputParams, relatedTarget: HTMLElement, errorMessage: string) => {
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
    });
    bus.on("input:set-valid", ({ id, value }: InputParams, relatedTarget: HTMLElement, errorMessage: string) => {
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
    });
  }
}
