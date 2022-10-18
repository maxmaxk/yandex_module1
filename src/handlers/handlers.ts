const render = () => {
    const templator = (<any>window).state.templator;
    const root: Element = document.getElementsByClassName("root")[0];
    if(root && templator) root.innerHTML = templator.compile();
};

(<any>window).onSubmitLogin = (form) => {
    /*TODO 
    * Implement API request for authorization
    */
    const login = form.login.value;
    const password = form.password.value;
    console.log(`try authorization to account: ${login}/${password}`);
    return false;
}

(<any>window).onSubmitRegistration = (form) => {
    /*TODO 
    * Implement API request for registaration
    */
    const login = form.login.value;
    console.log(`try registaration as ${login}`);
    return false;
}

(<any>window).onSearchChange = (target) => {
    /*TODO 
    * Implement searching through chats
    */
    console.log(`onSearchChange ${target.value}`);
}

(<any>window).onAddChat = () => {
    /*TODO 
    * Implement add chat handler
    */
    console.log(`onAddChat event`);
}

(<any>window).onChatItemActivate = (target) => {
    (<any>window).state.newMessageText = "";
    const newActiveChatId = parseInt(target.id.slice(8));
    if(!isNaN(newActiveChatId)) (<any>window).state.activeChatId = newActiveChatId;
    let chatItemList = document.getElementsByClassName('chat-item-list')[0];
    const scrollTop = chatItemList.scrollTop;
    render();
    chatItemList = document.getElementsByClassName('chat-item-list')[0];
    chatItemList.scrollTo(0,scrollTop);
}

(<any>window).onRemoveChat = () => {
    /*TODO 
    * Implement remove chat handler, add confirm modal form
    */
    console.log(`onRemoveChat event`);
}

(<any>window).onChatAddon = () => {
    /*TODO 
    * Implement addon chat handler
    */
    console.log(`onChatAddon event`);
}

(<any>window).onMessageChange = (target) => {
    /*TODO 
    * Implement onMessageChange event
    */
    console.log(`onMessageChange event ${target.value}`);
    (<any>window).state.newMessageText = target.value;
}

(<any>window).onSendMessage = () => {
    /*TODO 
    * Implement onSendMessage event
    */
    console.log(`onSendMessage event`);
    render();
}

(<any>window).onChangeData = () => {
    /*TODO 
    * Implement onChangeData event
    */
    console.log(`onChangeData event`);
    (<any>window).state.dataChangeMode = !(<any>window).state.dataChangeMode;
    render();
}

(<any>window).onLogout = (form) => {
    /*TODO 
    * Implement onSendMessage event
    */
    const login = form.login.value;
    console.log(`onLogout event: ${login}`);
    return false;
}





