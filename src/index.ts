import { pages } from "./pages/pages";
import { Block } from "./common/block";
import { Router } from "./common/router";
import { LoginBlock } from "./pages/login/loginBlock";
import { RegistrationBlock } from "./pages/registration/registrationBlock";
import { ProfileBlock } from "./pages/profile/profileBlock";
import { ChatListBlock } from "./pages/chat-list/chatListBlock";
import { Page404Block } from "./pages/page404/page404Block";
import { Page500Block } from "./pages/page500/page500Block";
import "./styles/styles.less";

const router = new Router(".root");
router
  .use(pages.login.url, LoginBlock as typeof Block)
  .use(pages.registration.url, RegistrationBlock as typeof Block)
  .use(pages.profile.url, ProfileBlock as typeof Block)
  .use(pages.chatList.url, ChatListBlock as typeof Block)
  .use(pages.page404.url, Page404Block as typeof Block)
  .use(pages.page500.url, Page500Block as typeof Block)
  .start();
