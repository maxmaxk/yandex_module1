import { KeyObject } from "./commonTypes";
import { HTTPTransport, METHODS } from "./fetch";
import { EventBus } from "./eventBus";
import { Router } from "./router";
import { pages } from "../pages/pages";
import { FormValidateData } from "./handlers";

type ReqParams = {
  url: string,
  method: string,
};

export type SignUpData = {
  first_name: string,
  second_name: string,
  login: string,
  email: string,
  password: string,
  phone: string,
}

export type SignInData = {
  login: string,
  password: string,
}

const baseUrl = "https://ya-praktikum.tech/api/v2";
const reqParams: {[key: string]: ReqParams} = {
  signUp: {
    url: "/auth/signup",
    method: METHODS.POST,
  },
  signIn: {
    url: "/auth/signin",
    method: METHODS.POST,
  },
  getUser: {
    url: "/auth/user",
    method: METHODS.GET,
  },
};

const statusOK = 200;
const bus = new EventBus();
const router = new Router(".root");

const methods: KeyObject = {
  [METHODS.GET]: HTTPTransport.get,
  [METHODS.POST]: HTTPTransport.post,
};

export class Requests {
  static makeRequest(reqParam: ReqParams, options?: KeyObject) {
    return methods[reqParam.method](`${baseUrl}${reqParam.url}`, options);
  }

  static getOptions(dataObj: KeyObject) {
    const dataValue = Object.keys(dataObj).reduce((acc: KeyObject, item: string) => {
      acc[item] = dataObj[item].value;
      return acc;
    }, {});
    return { headers: { "content-type": "application/json", credentials: "include" }, data: dataValue };
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

  static async onSubmitRequest(id: string, formValidateData: FormValidateData) {
    bus.emit("submit:start-waiting");
    try{
      const result = await Requests.submitData(id, formValidateData);
      if(result.status === statusOK) {
        if((id === "registration") || (id === "user-login")) {
          router.go(pages.chatList.url);
        }
      }else{
        try {
          const reason = JSON.parse(result.response).reason as string;
          bus.emit("submit:error", `Ошибка: ${reason}`);
        }catch(error) {
          bus.emit("submit:error", "Неизвестная ошибка сервера");
        }
      }
    }catch(error) {
      bus.emit("submit:error", error.message ?? "Ошибка сервера");
    }
    bus.emit("submit:stop-waiting");
  }

  static submitData(id: string, formValidateData: unknown) {
    switch(id) {
      case "registration":
        return Requests.signUp(formValidateData as SignUpData);
      case "user-login":
        return Requests.signIn(formValidateData as SignInData);
      default:
        return Promise.reject(new Error("Cannot assign request method to form id"));
    }
  }

  static async profileUpdate() {
    bus.emit("update:start-waiting");
    const result = await Requests.getUser();
    if(result.status === statusOK) {
      console.log("result=", result);
    }else{
      router.go(pages.login.url);
    }
    bus.emit("update:stop-waiting");
  }
}
