import { KeyObject } from "./commonTypes";

export class EventBus {
  listeners: KeyObject;

  static __instance: EventBus;

  constructor() {
    if (EventBus.__instance) {
      // eslint-disable-next-line no-constructor-return
      return EventBus.__instance;
    }
    EventBus.__instance = this;
    this.listeners = {};
  }

  on(event: string, callback: Function) {
    if(this.listeners[event]) {
      this.listeners[event].push(callback);
    }else{
      this.listeners[event] = [callback];
    }
  }

  off(event: string, callback: Function) {
    if(!this.listeners[event]) throw new Error(`Invalid event ${event}`);
    this.listeners[event] = this.listeners[event].filter((item: Function) => (item !== callback));
  }

  // @ts-ignore
  emit(event: string, ...args) {
    if(!this.listeners[event]) throw new Error(`Invalid event ${event}`);
    this.listeners[event].forEach((callback: Function) => {
      callback(...args);
    });
  }
}
