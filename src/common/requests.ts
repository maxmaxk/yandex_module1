import {
  KeyObject,
  submitActions,
  updateActions,
  chatActions,
} from "./common";
import { HTTPTransport, METHODS } from "./fetch";
import { EventBus } from "./eventBus";
import { Router } from "./router";
import { pages } from "../pages/pages";
import { FormValidateData } from "./handlers";
import { ChatWebSocket } from "./chatwebsocket";

type ReqParams = {
  url: string,
  method: string | null,
  targetId?: string,
};

export type SignUpData = {
  first_name: KeyObject,
  second_name: KeyObject,
  login: KeyObject,
  email: KeyObject,
  password: KeyObject,
  phone: KeyObject,
}

export type SignInData = {
  login: KeyObject,
  password: KeyObject,
}

export type ProfileChangeData = {
  first_name: KeyObject,
  second_name: KeyObject,
  display_name: KeyObject,
  login: KeyObject,
  email: KeyObject,
  phone: KeyObject,
  oldPassword: KeyObject,
  newPassword: KeyObject,
  avatar: KeyObject,
}

export type SendMessageData = {
  message: KeyObject,
}

const baseUrl = "https://ya-praktikum.tech/api/v2";
const reqParams: {[key: string]: ReqParams} = {
  signUp: {
    url: "/auth/signup",
    method: METHODS.POST,
    targetId: "registration",
  },
  signIn: {
    url: "/auth/signin",
    method: METHODS.POST,
    targetId: "user-login",
  },
  getUser: {
    url: "/auth/user",
    method: METHODS.GET,
  },
  profileChange: {
    url: "/user/profile",
    method: METHODS.PUT,
    targetId: "profile-form",
  },
  passwordChange: {
    url: "/user/password",
    method: METHODS.PUT,
  },
  avatarChange: {
    url: "/user/profile/avatar",
    method: METHODS.PUT,
  },
  logout: {
    url: "/auth/logout",
    method: METHODS.POST,
  },
  getChats: {
    url: "/chats",
    method: METHODS.GET,
  },
  addChat: {
    url: "/chats",
    method: METHODS.POST,
  },
  getChatToken: {
    url: "/chats/token",
    method: METHODS.POST,
  },
  addUserToChat: {
    url: "/chats/users",
    method: METHODS.PUT,
  },
  removeUserFromChat: {
    url: "/chats/users",
    method: METHODS.DELETE,
  },
  removeChat: {
    url: "/chats",
    method: METHODS.DELETE,
  },
  getUserId: {
    url: "/user/search",
    method: METHODS.POST,
  },
  getUserById: {
    url: "/user",
    method: METHODS.GET,
  },
  sendMessage: {
    url: "",
    method: null,
    targetId: "chat-message-form",
  },
};
const statusOK = 200;
const methods: KeyObject = {
  [METHODS.GET]: HTTPTransport.get,
  [METHODS.POST]: HTTPTransport.post,
  [METHODS.PUT]: HTTPTransport.put,
  [METHODS.DELETE]: HTTPTransport.delete,
};

export class Requests {
  static bus = new EventBus();

  static router = new Router(".root");

  static makeRequest(reqParam: ReqParams, options?: KeyObject) {
    if(!reqParam.method) throw new Error("Method not found");
    return methods[reqParam.method](`${baseUrl}${reqParam.url}`, options);
  }

  static getOptions(dataObj: KeyObject) {
    const dataValue = Object.keys(dataObj).reduce((acc: KeyObject, item: string) => {
      if(dataObj[item]?.value) acc[item] = dataObj[item].value;
      return acc;
    }, {});
    return { headers: { "content-type": "application/json", credentials: "include" }, data: dataValue };
  }

  static getAvatarOptions(dataObj: KeyObject) {
    const formData = new FormData();
    formData.append("avatar", dataObj as File);
    return {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        mimeType: "multipart/form-data",
        credentials: "include",
      },
      data: formData,
    };
  }

  static signUp(signUpData: SignUpData) {
    return Requests.makeRequest(reqParams.signUp, Requests.getOptions(signUpData));
  }

  static signIn(signInData: SignInData) {
    return Requests.makeRequest(reqParams.signIn, Requests.getOptions(signInData));
  }

  static getUser() {
    return Requests.makeRequest(reqParams.getUser);
  }

  static profileChange(profileChangeData: ProfileChangeData) {
    const profileChangeAccount = {
      ...profileChangeData, oldPassword: null, newPassword: null, avatar: null,
    };
    const profileChangePassword: KeyObject = {};
    profileChangePassword.oldPassword = profileChangeData.oldPassword;
    profileChangePassword.newPassword = profileChangeData.newPassword;
    const profileChangeAvatar = profileChangeData.avatar.value;
    let chain = Promise.resolve();
    chain = chain.then(() =>
      // eslint-disable-next-line implicit-arrow-linebreak
      Requests.makeRequest(reqParams.profileChange, Requests.getOptions(profileChangeAccount)));
    if(profileChangePassword.oldPassword?.value) {
      chain = chain.then(() =>
        // eslint-disable-next-line implicit-arrow-linebreak
        Requests.makeRequest(reqParams.passwordChange, Requests.getOptions(profileChangePassword)));
    }
    if(profileChangeAvatar.name) {
      chain = chain.then(() =>
        // eslint-disable-next-line implicit-arrow-linebreak
        Requests.makeRequest(
          reqParams.avatarChange,
          Requests.getAvatarOptions(profileChangeAvatar),
        ));
    }
    return chain;
  }

  static async logout() {
    await Requests.makeRequest(reqParams.logout);
    Requests.router.go(pages.login.url);
  }

  static async onSubmitRequest(targetId: string, formValidateData: FormValidateData) {
    Requests.bus.emit(submitActions.error, "");
    Requests.bus.emit(submitActions.startWaiting);
    try{
      const result = await Requests.submitData(targetId, formValidateData);
      if(result.status === statusOK) {
        if((targetId === reqParams.signUp.targetId) || (targetId === reqParams.signIn.targetId)) {
          Requests.router.go(pages.chatList.url);
        }
      }else{
        try {
          const reason = JSON.parse(result.response).reason as string;
          if(reason === "User already in system") {
            Requests.router.go(pages.chatList.url);
            return;
          }
          Requests.bus.emit(submitActions.error, `Ошибка: ${reason}`);
        }catch(error) {
          Requests.bus.emit(submitActions.error, "Неизвестная ошибка сервера");
        }
      }
    }catch(error) {
      Requests.bus.emit(submitActions.error, error.message ?? "Ошибка сервера");
    }
    Requests.bus.emit(submitActions.stopWaiting);
  }

  static submitData(targetId: string, formValidateData: unknown) {
    switch(targetId) {
      case reqParams.signUp.targetId:
        return Requests.signUp(formValidateData as SignUpData);
      case reqParams.signIn.targetId:
        return Requests.signIn(formValidateData as SignInData);
      case reqParams.profileChange.targetId:
        return Requests.profileChange(formValidateData as ProfileChangeData);
      case reqParams.sendMessage.targetId:
        return Requests.sendMessage(formValidateData as SendMessageData);
      default:
        return Promise.reject(new Error("Cannot assign request method to form id"));
    }
  }

  static async profileUpdate() {
    Requests.bus.emit(updateActions.startWaiting);
    const result = await Requests.getUser();
    if(result.status === statusOK) {
      try{
        Requests.bus.emit(updateActions.getData, JSON.parse(result.response));
      }catch(error) {
        Requests.bus.emit(submitActions.error, error.message);
      }
    }else{
      Requests.router.go(pages.login.url);
    }
  }

  static getAvatarResource(resourceId: string | null): string {
    if(resourceId) return `${baseUrl}/resources${resourceId}`;
    return "./resources/no-avatar.jpg";
  }

  static async getChats(titleFilter: string) {
    try{
      const result = await Requests.makeRequest(
        reqParams.getChats,
        Requests.getOptions({ title: { value: titleFilter } }),
      );
      const response = JSON.parse(result.response);
      if(result.status === statusOK) {
        Requests.bus.emit(chatActions.getChatList, response);
        Requests.bus.emit(chatActions.errorMsg, "");
      }else if(response.reason === "Cookie is not valid") {
        Requests.router.go(pages.login.url);
      }else{
        Requests.bus.emit(chatActions.errorMsg, response.reason);
      }
    }catch(error) {
      Requests.bus.emit(chatActions.errorMsg, error.message);
    }
  }

  static async addChat(chatTitle: string) {
    try{
      const result = await Requests.makeRequest(
        reqParams.addChat,
        Requests.getOptions({ title: { value: chatTitle } }),
      );
      const response = JSON.parse(result.response);
      if(result.status === statusOK) {
        Requests.getChats("");
      }else{
        Requests.bus.emit(chatActions.errorMsg, response.reason);
      }
    }catch(error) {
      Requests.bus.emit(chatActions.errorMsg, error.message);
    }
  }

  static getUserId(login: string) {
    return Requests.makeRequest(
      reqParams.getUserId,
      Requests.getOptions({ login: { value: login } }),
    );
  }

  static async addUserToChat(login: string, chatId: string) {
    const user = await Requests.getUserId(login);
    try{
      const userInfo = JSON.parse(user.response);
      if(!userInfo[0]) {
        Requests.bus.emit(chatActions.errorMsg, "User not found");
        return;
      }
      const result = await Requests.makeRequest(
        reqParams.addUserToChat,
        Requests.getOptions({ users: { value: [userInfo[0].id] }, chatId: { value: chatId } }),
      );
      if(result.status === statusOK) {
        console.log("user added");
      }else{
        const response = JSON.parse(result.response);
        Requests.bus.emit(chatActions.errorMsg, response.reason);
      }
    }catch(error) {
      Requests.bus.emit(chatActions.errorMsg, error.message);
    }
  }

  static async removeUserFromChat(login: string, chatId: string) {
    try{
      const user = await Requests.getUserId(login);
      const userInfo = JSON.parse(user.response);
      if(!userInfo[0]) {
        Requests.bus.emit(chatActions.errorMsg, "User not found");
        return;
      }
      const result = await Requests.makeRequest(
        reqParams.removeUserFromChat,
        Requests.getOptions({ users: { value: [userInfo[0].id] }, chatId: { value: chatId } }),
      );
      if(result.status === statusOK) {
        console.log("user removed");
      }else{
        const response = JSON.parse(result.response);
        Requests.bus.emit(chatActions.errorMsg, response.reason);
      }
    }catch(error) {
      Requests.bus.emit(chatActions.errorMsg, error.message);
    }
  }

  static async removeChat(chatId: string) {
    try{
      const chatWebSocket = new ChatWebSocket();
      chatWebSocket.close();
      const result = await Requests.makeRequest(
        reqParams.removeChat,
        Requests.getOptions({ chatId: { value: chatId } }),
      );
      if(result.status === statusOK) {
        console.log("chat removed");
      }else{
        const response = JSON.parse(result.response);
        Requests.bus.emit(chatActions.errorMsg, response.reason);
      }
    }catch(error) {
      Requests.bus.emit(chatActions.errorMsg, error.message);
    }
  }

  static async getChatToken(chatId: string) {
    try{
      const tokenReqParams = { ...reqParams.getChatToken };
      tokenReqParams.url += `/${chatId}`;
      const result = await Requests.makeRequest(tokenReqParams);
      const response = JSON.parse(result.response);
      if(result.status === statusOK) {
        Requests.bus.emit(chatActions.openSocket, response.token);
      }else{
        Requests.bus.emit(chatActions.errorMsg, response.reason);
      }
    }catch(error) {
      Requests.bus.emit(chatActions.errorMsg, error.message);
    }
  }

  static async getUserById(userId: number) {
    try{
      const getUserByIdParams = { ...reqParams.getUserById };
      getUserByIdParams.url += `/${userId}`;
      const result = await Requests.makeRequest(getUserByIdParams);
      const response = JSON.parse(result.response);
      if(result.status === statusOK) return response;
      console.log(`User id ${userId} not found`);
      return null;
    }catch(error) {
      Requests.bus.emit(chatActions.errorMsg, error.message);
      return null;
    }
  }

  static async sendMessage(sendMessageData: SendMessageData) {
    const chatWebSocket = new ChatWebSocket();
    try{
      await chatWebSocket.sendMessage(sendMessageData);
      return Promise.resolve({ status: statusOK });
    }catch(error) {
      console.log(`error send message ${error.message}`);
      return Promise.reject();
    }
  }
}
