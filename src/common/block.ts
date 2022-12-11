import { EventBus } from "./eventBus";
import { Templator } from "../templator/templator";
import { KeyObject, blockActions } from "./common";

type Meta = {
  tagName: string,
  props: object
};

export class Block<Props extends KeyObject> {
  _element: HTMLElement | null = null;

  _meta: Meta | null = null;

  _eventBus: EventBus;

  _props: Props;

  _id: string | null = null;

  _children: KeyObject;

  _setUpdate = false;

  constructor(tagName = "div", propsAndChildren: Props | {} = {}) {
    const { children, props } = Block._getChildren(propsAndChildren);
    this._children = children;
    this._meta = {
      tagName,
      props,
    };
    this._id = Math.random().toString().slice(2);
    this._children = this._makePropsProxy(children);
    this._props = this._makePropsProxy({ ...props, __id: this._id });
    this._eventBus = new EventBus();
    this._registerEvents(this._eventBus);
    this._eventBus.emit(blockActions.init);
  }

  // @ts-ignore
  static _getChildren(propsAndChildren: any) {
    const children: KeyObject = {};
    const props: KeyObject = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if(value instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });
    return { children, props };
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(blockActions.init, this.init.bind(this));
    eventBus.on(blockActions.flowCDM, this._componentDidMount.bind(this));
    eventBus.on(blockActions.flowCDU, this._componentDidUpdate.bind(this));
    eventBus.on(blockActions.flowRender, this._render.bind(this));
  }

  _createResources() {
    if(!this._meta) return;
    const { tagName } = this._meta;
    this._element = Block._createDocumentElement(tagName);
  }

  init() {
    this._createResources();
    this._eventBus.emit(blockActions.flowRender);
  }

  _componentDidMount() {
    this.componentDidMount();
    Object.values(this._children).forEach((child) => {
      child.dispatchComponentDidMount();
    });
  }

  componentDidMount() {
    return undefined;
  }

  dispatchComponentDidMount() {
    this._eventBus.emit(blockActions.flowCDM);
  }

  _componentDidUpdate(oldProps: Props, newProps: Props) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  componentDidUpdate(oldProps: Props, newProps: Props) {
    return JSON.stringify(oldProps) !== JSON.stringify(newProps);
  }

  setProps = (nextProps: Props) => {
    if (!nextProps) return;
    this._setUpdate = false;
    const oldValue = { ...this._props };
    const { children, props } = Block._getChildren(nextProps);
    if(Object.values(children).length) {
      Object.assign(this._children, children);
    }
    if(Object.values(props).length) {
      Object.assign(this._props, props);
    }
    if(this._setUpdate) {
      this._eventBus.emit(blockActions.flowCDU, oldValue, { ...this._props });
      this._setUpdate = false;
    }
  };

  get element() {
    return this._element;
  }

  _render() {
    if(!this._element) return;
    const block = this.render();
    this._removeEvents();
    this._element.innerHTML = "";
    if(block instanceof Node) {
      this._element.appendChild(block);
    }else{
      this._element.insertAdjacentHTML("beforeend", block);
    }
    this._addEvents();
    this._addAttributes();
  }

  render(): any {
    return "";
  }

  getContent() {
    return this.element;
  }

  _addEvents() {
    const { events = {} } = this._props as KeyObject;
    Object.keys(events).forEach((eventName) => {
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  _removeEvents() {
    const { events = {} } = this._props as KeyObject;
    Object.keys(events).forEach((eventName) => {
      this._element?.removeEventListener(eventName, events[eventName]);
    });
  }

  _addAttributes() {
    const { attr = {} } = this._props as KeyObject;
    Object.entries(attr).forEach(([key, value]) => {
      this._element?.setAttribute(key, value as string);
    });
  }

  // @ts-ignore
  _makePropsProxy(props): Props {
    const self = this;
    return new Proxy(props, {
      get(target, prop) {
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target, prop, value) {
        if(target[prop] !== value) {
          target[prop] = value;
          self._setUpdate = true;
        }
        return true;
      },
      deleteProperty() {
        throw new Error("Access denied");
      },
    });
  }

  // @ts-ignore
  static _createDocumentElement(tagName) {
    let element = null;
    try{
      element = document.createElement(tagName);
    }catch(e) {
      console.log(e.message);
    }
    return element;
  }

  compile(template: string, context: KeyObject) {
    const propsAndStubs = { ...context };

    Object.entries(this._children).forEach(([key, child]) => {
      propsAndStubs.replaces.push({ [key]: `<div data-id="${child._id}"></div>` });
    });

    const fragment = Block._createDocumentElement("template");
    const templater = new Templator(template, propsAndStubs);
    fragment.innerHTML = templater.compile();
    Object.values(this._children).forEach((child) => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      stub.replaceWith(child.getContent());
    });
    return fragment.content;
  }

  static restoreFocus(element: HTMLElement) {
    const findElement: HTMLElement | null = document.getElementById(element?.id);
    if(findElement) {
      findElement.focus();
      if(findElement.tagName === "BUTTON") findElement.click();
    }
  }
}
