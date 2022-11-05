export class Validator{
    targetName: string;
    value: any;
    constructor(target, value?: any){
        if(value === undefined){
            if(!target.id) throw new Error("Validation element has no id");
            this.targetName = target.id;
            this.value = target.value;
        }else{
            this.targetName = target;
            this.value = value;
        }
    }

    isValid(): boolean{
        const validatorHandlers = {
            login: this.isLoginValid,
            display_name: this.isLoginValid,
            password: this.isPasswordValid,
            oldPassword: this.isPasswordValid,
            newPassword: this.isPasswordValid,
            first_name: this.isNameValid,
            second_name: this.isNameValid,
            email: this.isEmailValid,
            phone: this.isPhoneValid,
            avatar: this.isAvatarValid,
            message: this.isMessageValid
        }
        return validatorHandlers[this.targetName] ? validatorHandlers[this.targetName](this.value): false;
    }

    isLoginValid(login: string): boolean{
        const reg = new RegExp(/(?=(?!^\d+$)^.+$)(?=^([0-9A-Za-z-_]){3,20}$)/);
        return reg.test(login);
    }

    isPasswordValid(password: string): boolean{
        const reg = new RegExp(/(?=^\S*?[A-Z]\S*?$)(?=^\S*?[0-9]\S*?$)(?=^.{8,40}$)/);
        return reg.test(password);
    }
    
    isNameValid(name: string): boolean{
        const reg = new RegExp(/^[A-ZА-Я]+[A-ZА-Яa-zа-я-]*?$/);
        return reg.test(name);
    }

    isEmailValid(email: string): boolean{
        const reg = new RegExp(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/);
        return reg.test(email);
    }

    isPhoneValid(phone: string): boolean{
        const reg = new RegExp(/^\+?\d{10,15}$/);
        return reg.test(phone);
    }

    isAvatarValid(avatar: string): boolean{
        return true;
    }

    isMessageValid(message: string): boolean{
        return message !== "";
    }
}