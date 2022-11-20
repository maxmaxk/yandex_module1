export type KeyObject = {
  [key: string]: any
};

export type InputParams = {
    id?: string,
    value: string
}

export const profileActions = {
  changeMode: "profile:change-mode",
};

export const inputActions = {
  setInvalid: "input:set-invalid",
  setValid: "input:set-valid",
};

export const submitActions = {
  startWaiting: "submit:start-waiting",
  stopWaiting: "submit:stop-waiting",
  error: "submit:error",
};

export const updateActions = {
  startWaiting: "update:start-waiting",
  getData: "update:get-data",
};

export const chatActions = {
  changeActive: "chat:change-active",
  messageSend: "chat:message-send",
  getChatList: "chat:get-list",
  addChatPromptOpen: "chat:addchatprompt-open",
  addUserToChatPromptOpen: "chat:addusertochatprompt-open",
  removeUserFromChatPromptOpen: "chat:removeuserfromchatprompt-open",
  addChat: "chat:add",
  addUserToChat: "chat:addusertochat",
  removeUserFromChat: "chat:removeuserfromchat",
  promptClose: "chat:prompt-close",
  errorMsg: "chat:error-msg",
  openSocket: "chat:open-socket",
};

export const blockActions = {
  init: "init",
  flowCDM: "flow:component-did-mount",
  flowCDU: "flow:component-did-update",
  flowRender: "flow:render",
};
