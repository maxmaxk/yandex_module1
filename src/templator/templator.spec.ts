import { expect } from "chai";
import { Templator } from "./templator";

// @ts-ignore
describe("Templator tests", () => {
  const simpleTemplate = new Templator("simple template", {});
  // @ts-ignore
  it("try compile simple template", () => {
    expect(simpleTemplate.compile()).to.equal("simple template");
  });
  const templateWithReplace = new Templator("templateWithReplace: #replaceIt#", {
    replaces: [{ replaceIt: "replacedIt" }],
  });
  // @ts-ignore
  it("try compile template with replace", () => {
    expect(templateWithReplace.compile()).to.equal("templateWithReplace: replacedIt");
  });
  const templateWithLoop = new Templator("<*#item.id#*>", {
    loops: [{ item: [{ id: "first" }, { id: "second" }] }],
  });
  // @ts-ignore
  it("try compile template with loop", () => {
    expect(templateWithLoop.compile()).to.equal("<first><second>");
  });
});
