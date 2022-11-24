export type KeyObject = {
  [key: string]: any
};

export type InputParams = {
    id?: string,
    value: string
}

export const profileActions = {
  changeMode: "profile:change-mode",
  changePassEnable: "profile:change-pass-enabled",
  changePassDisable: "profile:change-pass-disabled",
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
  getChatList: "chat:get-list",
  getHistory: "chat:get-history",
  getMessage: "chat:get-message",
  addChatPromptOpen: "chat:addchatprompt-open",
  addUserToChatPromptOpen: "chat:addusertochatprompt-open",
  removeUserFromChatPromptOpen: "chat:removeuserfromchatprompt-open",
  removeChatPromptOpen: "chat:removechatprompt-open",
  addChat: "chat:add",
  addUserToChat: "chat:addusertochat",
  removeUserFromChat: "chat:removeuserfromchat",
  removeChat: "chat:removechat",
  promptClose: "chat:prompt-close",
  errorMsg: "chat:error-msg",
  openSocket: "chat:open-socket",
  scrollDown: "chat:scroll-down",
  highlightActive: "chat:highlight-active",
};

export const blockActions = {
  init: "init",
  flowCDM: "flow:component-did-mount",
  flowCDU: "flow:component-did-update",
  flowRender: "flow:render",
};
