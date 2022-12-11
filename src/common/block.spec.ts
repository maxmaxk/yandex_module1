import { expect } from "chai";
import { Block } from "./block";

// @ts-ignore
describe("Component tests", () => {
  const block = new Block("div", { prop: "testProp" });
  it("check block has props", () => {
    expect(block._props.prop).eq("testProp");
  });
  const child = new Block("div", { prop: "testChildProp" });
  const blockWithChild = new Block("div", { prop: child });
  it("check block has child", () => {
    expect(blockWithChild._children.prop._props.prop).eq("testChildProp");
  });
});
