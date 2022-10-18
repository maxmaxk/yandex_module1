type TLoop = {
    startLoop: number,
    endLoop: number,
}

let _context: any;

export const compiler = (template: string, context: object): string => {
    if(!template) throw new Error("Wrong template data");
    if(!context) throw new Error("Wrong context data");
    _context = context;
    template = parseLoops(template);
    template = parseReplaces(template);
    return template;
}

const parseLoops = (template: string): string => {
    let loop: TLoop | null = hasLoop(template);
    while(loop){
        template = createLoop(template, loop);
        loop = hasLoop(template);
    }
    return template;
}

const hasLoop = (template: string): TLoop | null => {
    const startLoop = template.indexOf("<*");
    const endLoop = template.indexOf("*>");
    if(startLoop > endLoop) throw new Error("Wrong loop format");
    return (startLoop >= 0) && (endLoop >= 0) ? {startLoop, endLoop} : null;
}

const createLoop = (template: string, loop: TLoop): string => {
    const {startLoop, endLoop} = loop;
    const loopTemplate = "<" + template.slice(startLoop + 2, endLoop) + ">";
    const populateLoopStr = populateLoop(loopTemplate);
    return template.slice(0,startLoop) + populateLoopStr + template.slice(endLoop + 2);
}

const populateLoop = (loopTemplate: string): string => {
    if(!Array.isArray(_context.loops)) throw new Error("Wrong context loop");
    const findLoop = _context.loops.filter(item => {
        if(typeof item !== "object") return false;
        return loopTemplate.includes("#" + Object.keys(item)[0]); 
    });
    if(findLoop.length > 1) throw new Error("More then one identificator in one loop");
    if(findLoop.length === 1) loopTemplate = addItems(loopTemplate, findLoop[0]);
    return loopTemplate;
}

const addItems = (loopTemplate: string, loopObj: any): string => {
    let res = "";
    const indent = Object.keys(loopObj)[0];
    let i = 0;
    loopObj[indent].forEach(element => {
        let newTempString = loopTemplate;
        Object.entries(element).forEach(([key, value]) => {
            const re = new RegExp(getCagedString(indent + "." + key), "g");
            newTempString = newTempString.replace(re, value as string);
            newTempString = newTempString.replace(/#id#/g, indent + i);
        });
        res += newTempString;
        i++;
    });
    return res;
}

const parseReplaces = (template: string): string => {
    if(!Array.isArray(_context.replaces)) throw new Error("Wrong replace context");
    _context.replaces.forEach(element => {
        const indent = Object.keys(element)[0];
        if(typeof element[indent] === "string") template = template.replace(new RegExp(getCagedString(indent), "g"), element[indent].toString());
    })
    return template;
}

const getCagedString = (item: string): string => `#${item}#`;