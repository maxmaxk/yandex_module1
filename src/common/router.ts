import { Route } from "./route";
import { Block } from "./block";
import { pages } from "../pages/pages";
import { EventBus } from "./eventBus";

export class Router {
  static __instance: Router;

  routes: Route[];

  history: History;

  _currentRoute: Route | null;

  _rootQuery: string;

  constructor(rootQuery?: string) {
    if (Router.__instance) {
      // eslint-disable-next-line no-constructor-return
      return Router.__instance;
    }
    if(!rootQuery) throw new Error("Root query absent");
    this.routes = [];
    try{
      this.history = window.history;
    }catch(e) {
      console.log(e.message);
    }
    this._currentRoute = null;
    this._rootQuery = rootQuery;
    Router.__instance = this;
  }

  use(pathname: string, block: typeof Block) {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  start() {
    window.onpopstate = (event: PopStateEvent) => {
      this._onRoute((event.currentTarget as Window).location.pathname);
    };
    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string) {
    const route = this.getRoute(pathname);
    if(!route) {
      this.go(pages.page404.url);
      return;
    }
    this._currentRoute = route;
    route._block = null;
    route.render();
  }

  go(pathname: string) {
    const bus = new EventBus();
    bus.clear();
    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  static back() {
    window.history.back();
  }

  static forward() {
    window.history.forward();
  }

  getRoute(pathname: string) {
    return this.routes.find((route: Route) => route.match(pathname));
  }
}
