import { expect } from "chai";
import { HTTPTransport } from "./fetch";

// @ts-ignore
describe("Fetch tests", () => {
  it("check no method", async () => {
    let res = null;
    try{
      await HTTPTransport.request("");
    }catch(e) {
      res = e.message;
    }
    expect(res).eq("No method");
  });

  it("check get method exist", async () => {
    let res = null;
    try{
      res = await HTTPTransport.get;
    }catch(e) {
      res = e.message;
    }
    expect(typeof res).eq("function");
  });

  it("check post method exist", async () => {
    let res = null;
    try{
      res = await HTTPTransport.post;
    }catch(e) {
      res = e.message;
    }
    expect(typeof res).eq("function");
  });

  it("check put method exist", async () => {
    let res = null;
    try{
      res = await HTTPTransport.put;
    }catch(e) {
      res = e.message;
    }
    expect(typeof res).eq("function");
  });

  it("check delete method exist", async () => {
    let res = null;
    try{
      res = await HTTPTransport.delete;
    }catch(e) {
      res = e.message;
    }
    expect(typeof res).eq("function");
  });
});
