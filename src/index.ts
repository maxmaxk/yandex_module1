import { pages } from "./pages/pages";
import { Block } from "./common/block";
import { MainBlock } from "./pages/main/mainBlock";
import { LoginBlock } from "./pages/login/loginBlock";
import { RegistrationBlock } from "./pages/registration/registrationBlock";
import { ProfileBlock } from "./pages/profile/profileBlock";
import { ChatListBlock } from "./pages/chat-list/chatListBlock";
import { Page404Block } from "./pages/page404/page404Block";
import { Page500Block } from "./pages/page500/page500Block";

const pageName = window.location.pathname;
let block: Block<{}> | null = null;
switch(pageName) {
  case pages.main.url:
    block = new MainBlock();
    break;
  case pages.login.url:
    block = new LoginBlock();
    break;
  case pages.registration.url:
    block = new RegistrationBlock();
    break;
  case pages.chartList.url:
    block = new ChatListBlock();
    break;
  case pages.profile.url:
    block = new ProfileBlock();
    break;
  case pages.page404.url:
    block = new Page404Block();
    break;
  case pages.page500.url:
    block = new Page500Block();
    break;
  default:
    block = new Page404Block();
}

const root: Element = document.getElementsByClassName("root")[0];
if(root && block) root.appendChild(block.getContent() as Node);
