import { EventBus } from "./eventBus";
import { Templator } from "../templator/templator";

type Meta = {
  tagName: string,
  props: object
};

type KeyObject = {
  [key: string]: any
};

export class Block {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render"
  };

  _element: HTMLElement | null = null;
  _meta: Meta | null = null;
  _eventBus: EventBus;
  _props: KeyObject;
  _id: string | null = null;
  _children: KeyObject;
  _setUpdate: boolean = false;

  constructor(tagName = "div", propsAndChildren = {}) {
    const { children, props } = this._getChildren(propsAndChildren);
    this._children = children;
    this._meta = {
      tagName,
      props
    };
    this._id = (Math.random() + "").slice(2);
    this._children = this._makePropsProxy(children);
    this._props = this._makePropsProxy({...props, __id: this._id});
    this._eventBus = new EventBus();
    this._registerEvents(this._eventBus);
    this._eventBus.emit(Block.EVENTS.INIT);
  }

  _getChildren(propsAndChildren) {
    const children = {};
    const props = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });
    return { children, props };
  }

  _registerEvents(eventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _createResources() {
    if(!this._meta) return;
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  init() {
    this._createResources();
    this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  _componentDidMount() {
    this.componentDidMount();
    Object.values(this._children).forEach(child => {
      child.dispatchComponentDidMount();
    });
  }

  componentDidMount() {}

	dispatchComponentDidMount() {
		this._eventBus.emit(Block.EVENTS.FLOW_CDM);
	}

  _componentDidUpdate(oldProps, newProps) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  componentDidUpdate(oldProps, newProps) {
    return JSON.stringify(oldProps) !== JSON.stringify(newProps);
  }

  setProps = nextProps => {
    if (!nextProps) return;
    this._setUpdate = false;
    const oldValue = {...this._props};
    const { children, props } = this._getChildren(nextProps);
    if(Object.values(children).length){
      Object.assign(this._children, children);
    }
    if(Object.values(props).length){
      Object.assign(this._props, props);
    }
    if(this._setUpdate){
      this._eventBus.emit(Block.EVENTS.FLOW_CDU, oldValue, {...this._props});
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
    if(block instanceof Node){
      this._element.appendChild(block);
    }else{
      this._element.insertAdjacentHTML('beforeend', block);
    }
    this._addEvents();
    this._addAttributes();
  }

  render(): any{
    return "";
  }

  getContent() {
    return this.element;
  }

  _addEvents() {
    const {events = {}} = this._props as KeyObject;
    Object.keys(events).forEach(eventName => {
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  _removeEvents() {
    const {events = {}} = this._props as KeyObject;
    Object.keys(events).forEach(eventName => {
      this._element?.removeEventListener(eventName, events[eventName]);
    });
  }

  _addAttributes() {
    const {attr = {}} = this._props as KeyObject;
    Object.entries(attr).forEach(([key, value]) => {
      this._element?.setAttribute(key, value as string);
    })
  }

  _makePropsProxy(props): ProxyConstructor{
    const self = this;
    return new Proxy(props, {
      get(target, prop) {
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target, prop, value) {
        if(target[prop] !== value){
          target[prop] = value;
          self._setUpdate = true;
        }
        return true;
      },
      deleteProperty() {
        throw new Error("Access denied");
      }
    });
  }

  _createDocumentElement(tagName) {
    return document.createElement(tagName);
  }

  compile(template: string, props: KeyObject) {
    
    const propsAndStubs = { ...props };

    Object.entries(this._children).forEach(([key, child]) => {
        propsAndStubs.replaces.push({[key]: `<div data-id="${child._id}"></div>`});
    });

    const fragment = this._createDocumentElement('template');
    const templater = new Templator(template, propsAndStubs)
    fragment.innerHTML = templater.compile();
    Object.values(this._children).forEach(child => {
        const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
        stub.replaceWith(child.getContent());
    });

    return fragment.content;
  }

  restoreFocus(element: HTMLElement) {
    const findElement: HTMLElement | null = document.getElementById(element?.id);
    if(findElement) findElement.focus();
  }

}