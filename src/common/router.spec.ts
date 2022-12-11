import { expect } from "chai";
// @ts-ignore
import { JSDOM } from "jsdom";
import { pages } from "../pages/pages";
import { Block } from "./block";
import { LoginBlock } from "../pages/login/loginBlock";
import { RegistrationBlock } from "../pages/registration/registrationBlock";
import { Router } from "./router";

// @ts-ignore
describe("Router tests", () => {
  const jsdom = new JSDOM("<!doctype html><html><body><div class='root'></div></body></html>");
  const { window } = jsdom;
  const windowRef = global.window;
  // @ts-ignore
  global.window = window;
  const router = new Router(".root");
  // @ts-ignore
  it("check if routes empty", () => {
    expect(router.routes.length).eq(0);
  });
  // @ts-ignore
  it("try add first route", () => {
    router.use(pages.login.url, LoginBlock as typeof Block);
    expect(router.routes.length).eq(1);
  });
  // @ts-ignore
  it("try add second route", () => {
    router.use(pages.registration.url, RegistrationBlock as typeof Block);
    expect(router.routes.length).eq(2);
  });
  // @ts-ignore
  global.window = windowRef;
});
