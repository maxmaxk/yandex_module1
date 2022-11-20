/*
* TODO: Refactor state const to Store class
*/

import { KeyObject } from "./common";

type State = {
  activeChatId: number,
  newMessageText: string,
  dataChangeMode: boolean,
  promptInput: string,
  chatList: KeyObject[],
}

export const state: State = {
  activeChatId: -1,
  newMessageText: "",
  dataChangeMode: false,
  promptInput: "",
  chatList: [],
};
