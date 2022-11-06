type State = {
  activeChatId: number,
  newMessageText: string,
  dataChangeMode: boolean,
}

export const state: State = {
  activeChatId: -1,
  newMessageText: "",
  dataChangeMode: false,
};
