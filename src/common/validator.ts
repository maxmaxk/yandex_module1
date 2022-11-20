import { KeyObject } from "./common";

export class Validator {
  targetName: string;

  value: any;

  // @ts-ignore
  constructor(target, value?: any) {
    if(value === undefined) {
      if(!target.id) throw new Error("Validation element has no id");
      this.targetName = target.id;
      this.value = target.value;
    }else{
      this.targetName = target;
      this.value = value;
    }
  }

  getErrorMessage(): string {
    const validatorHandlers: KeyObject = {
      login: Validator.getLoginErrorMessage,
      display_name: Validator.getLoginErrorMessage,
      password: Validator.getPasswordErrorMessage,
      oldPassword: Validator.getPasswordErrorMessage,
      newPassword: Validator.getPasswordErrorMessage,
      first_name: Validator.getNameErrorMessage,
      second_name: Validator.getNameErrorMessage,
      email: Validator.getEmailErrorMessage,
      phone: Validator.getPhoneErrorMessage,
      avatar: Validator.getAvatarErrorMessage,
      message: Validator.getMessageErrorMessage,
    };
    return validatorHandlers[this.targetName]
      ? validatorHandlers[this.targetName](this.value) : "";
  }

  static getLoginErrorMessage(login: string): string {
    const reg = new RegExp(/(?=(?!^\d+$)^.+$)(?=^([0-9A-Za-z-_]){3,20}$)/);
    return reg.test(login) ? "" : `Логин должен быть от 3 до 20 символов, латиница, 
      может содержать цифры, но не состоять из них, без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание)`;
  }

  static getPasswordErrorMessage(password: string): string {
    const reg = new RegExp(/(?=^\S*?[A-Z]\S*?$)(?=^\S*?[0-9]\S*?$)(?=^.{8,40}$)/);
    return reg.test(password) ? "" : "Пароль должен быть от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра.";
  }

  static getNameErrorMessage(name: string): string {
    const reg = new RegExp(/^[A-ZА-Я]+[A-ZА-Яa-zа-я-]*?$/);
    return reg.test(name) ? "" : `Имя/фамилия должны быть латиницей или кириллицей, первая буква должна быть заглавной, 
      без пробелов и без цифр, нет спецсимволов (допустим только дефис)`;
  }

  static getEmailErrorMessage(email: string): string {
    const reg = new RegExp(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/);
    return reg.test(email) ? "" : "Введите корректный адрес электронной почты";
  }

  static getPhoneErrorMessage(phone: string): string {
    const reg = new RegExp(/^\+?\d{10,15}$/);
    return reg.test(phone) ? "" : "Телефон должен содержать от 10 до 15 символов, состоять из цифр, может начинается с плюса";
  }

  static getAvatarErrorMessage(): string {
    return "";
  }

  static getMessageErrorMessage(message: string): string {
    return (message !== "") ? "" : "Сообщение не может быть пустым";
  }
}
