import { compiler } from "./compiler";
export class Templator{
    template: string;
    contextGetter: Function;
    compiler: Function;
    setTemplate(template: string){
        this.template = template;
    }
    setContextGetter(contextGetter: Function){
        this.contextGetter = contextGetter;
    }   
    compile(): string {
        return compiler(this.template, this.contextGetter());
    }
}