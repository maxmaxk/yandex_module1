import { compiler } from "./compiler";

export class Templator {
  template: string;

  contextGetter: Function;

  context: object;

  compiler: Function;

  constructor(template: string, context: object) {
    this.template = template;
    this.context = context;
  }

  compile(): string {
    return compiler(this.template, this.context);
  }
}
