export class Validator {
  targetName: string;

  value: any;

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

  isValid(): boolean {
    const validatorHandlers = {
      login: Validator.isLoginValid,
      display_name: Validator.isLoginValid,
      password: Validator.isPasswordValid,
      oldPassword: Validator.isPasswordValid,
      newPassword: Validator.isPasswordValid,
      first_name: Validator.isNameValid,
      second_name: Validator.isNameValid,
      email: Validator.isEmailValid,
      phone: Validator.isPhoneValid,
      avatar: Validator.isAvatarValid,
      message: Validator.isMessageValid,
    };
    return validatorHandlers[this.targetName]
      ? validatorHandlers[this.targetName](this.value) : false;
  }

  static isLoginValid(login: string): boolean {
    const reg = new RegExp(/(?=(?!^\d+$)^.+$)(?=^([0-9A-Za-z-_]){3,20}$)/);
    return reg.test(login);
  }

  static isPasswordValid(password: string): boolean {
    const reg = new RegExp(/(?=^\S*?[A-Z]\S*?$)(?=^\S*?[0-9]\S*?$)(?=^.{8,40}$)/);
    return reg.test(password);
  }

  static isNameValid(name: string): boolean {
    const reg = new RegExp(/^[A-ZА-Я]+[A-ZА-Яa-zа-я-]*?$/);
    return reg.test(name);
  }

  static isEmailValid(email: string): boolean {
    const reg = new RegExp(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/);
    return reg.test(email);
  }

  static isPhoneValid(phone: string): boolean {
    const reg = new RegExp(/^\+?\d{10,15}$/);
    return reg.test(phone);
  }

  static isAvatarValid(avatar: string): boolean {
    return avatar !== "";
  }

  static isMessageValid(message: string): boolean {
    return message !== "";
  }
}
