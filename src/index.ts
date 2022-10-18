import { pages } from "./pages/pages";
import { Templator } from "./templator/templator";

import { mainTemplate } from "./pages/main/main.tmpl";
import { mainContextGetter } from "./pages/main/mainContext";

import { loginTemplate } from "./pages/login/login.tmpl";
import { loginContextGetter } from "./pages/login/loginContext";

import { registrationTemplate } from "./pages/registration/registration.tmpl";
import { registrationContextGetter } from "./pages/registration/registrationContext";

import { chatListTemplate } from "./pages/chat-list/chatList.tmpl";
import { chatListContextGetter } from "./pages/chat-list/chatListContext";

import { profileTemplate } from "./pages/profile/profile.tmpl";
import { profileContextGetter } from "./pages/profile/profileContext";

import { unknownTemplate } from "./pages/unknown-page/unknownPage.tmpl";
import { page404Getter } from "./pages/page404/page404";
import { page500Getter } from "./pages/page500/page505";


const pageName = window.location.pathname;
const templator = new Templator;
switch(pageName){
  case pages.main:
    templator.setTemplate(mainTemplate);
    templator.setContextGetter(mainContextGetter);
    break;
  case pages.login:
    templator.setTemplate(loginTemplate);
    templator.setContextGetter(loginContextGetter);
    break;
  case pages.registration:
    templator.setTemplate(registrationTemplate);
    templator.setContextGetter(registrationContextGetter);
    break;
  case pages.chartList:
    templator.setTemplate(chatListTemplate);
    templator.setContextGetter(chatListContextGetter);
    break;
  case pages.profile:
    templator.setTemplate(profileTemplate);
    templator.setContextGetter(profileContextGetter);
    break;
  case pages.page404:
    templator.setTemplate(unknownTemplate);
    templator.setContextGetter(page404Getter);
    break;
  case pages.page500:
    templator.setTemplate(unknownTemplate);
    templator.setContextGetter(page500Getter);
    break;
  default:
    templator.setTemplate(unknownTemplate);
    templator.setContextGetter(page404Getter);
}

(<any>window).state.templator = templator;
const root: Element = document.getElementsByClassName("root")[0];
if(root) root.innerHTML = templator.compile();
