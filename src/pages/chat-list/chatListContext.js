import { pages } from "../pages";
/*  TODO
*   Get a real chat list
*/
const testChatList = () => [
    "Johnny Depp",
    "Al Pacino",
    "Robert De Niro",
    "Kevin Spacey",
    "Denzel Washington",
    "Russell Crowe",
    "Brad Pitt",
    "Angelina Jolie",
    "Leonardo DiCaprio",
    "Tom Cruise",
    "John Travolta",
    "Arnold Schwarzenegger",
    "Sylvester Stallone",
    "Kate Winslet",
    "Christian Bale",
    "Morgan Freeman",
    "Keanu Reeves",
    "Nicolas Cage",
    "Hugh Jackman",
    "Edward Norton",
    "Bruce Willis",
    "Tom Hanks",
    "Charlize Theron",
    "Will Smith",
    "Sean Connery"].map((person, key) => ({
        name: person,
        image: `./resources/${key}.jpg`,
        lastMessageOwn: key % 2 === 0 ? "Вы: ": "",
        lastMessage: ["Как дела?","Говорят Голливуд уже не тот","У нас сегодня дождь","Приезжай в гости","стикер"][key % 5],
        time: ["11:22","Пн","Вс","11 апр 2022"][key % 4],
        unreadCount: ["","1","2"][key % 3],
        isActiveClass: window.state.activeChatId === key ? " active" : ""
}));

/*
* TODO
* Get real message list
*/

const deliveryStatus = {
    none: "message-none",
    sended: "message-sended",
    recieved: "message-recieved",
    readed: "message-readed"
};

const testMessageList = () => {
    return [
        {
            type:"date-message", 
            content: "сегодня", 
        },
        {
            type:"companion-message", 
            content: "Как дела, старичок?", 
            time: "11:55", 
            status: deliveryStatus.none
        },
        {
            type:"my-message", 
            content: `Да ничего ${testChatList()[window.state.activeChatId]?.name.split(" ")[0]}, как у тебя?`, 
            time: "11:57", 
            status: deliveryStatus.readed
        },
        {
            type:"companion-message", 
            content: "Да мне тут, прикинь, подогнали новую роль. Буду играть Ватмана, зацени костюмчик:", 
            time: "12:03",
            status: deliveryStatus.none
        },
        {
            type:"companion-message", 
            content: "<img src='./resources/25.jpg'", 
            time: "12:04",
            status: deliveryStatus.none
        },
        
    ]
}

export const chatListContextGetter = () => {
    const activeChat = testChatList()[window.state.activeChatId];
    const testMessageList_ = testMessageList();
    if(window.state.newMessageText){
        testMessageList_.push({
            type:"my-message", 
            content: window.state.newMessageText, 
            time: "12:55", 
            status: deliveryStatus.readed
        });
        testMessageList_.push({
            type:"companion-message", 
            content: "Старичок, я смогу получить это сообщение, когда ваш студент доделает интеграцию с бэком во втором спринте", 
            time: "12:55", 
            status: deliveryStatus.none
        });
    }
    return {
    replaces: [
        {profileUrl: pages.profile},
        {addChatText: "Добавить чат"},
        {removeChatText: "УДАЛИТЬ ЧАТ"},
        {onSearchChange: "onSearchChange(this)"},
        {onAddChat: "onAddChat()"},
        {onRemoveChat: "onRemoveChat(this)"},
        {onChatItemActivate: "onChatItemActivate(this)"},
        {onChatAddon: "onChatAddon()"},
        {onMessageChange: "onMessageChange(this)"},
        {onSendMessage: "onSendMessage()"},
        {isActiveChat: window.state.activeChatId < 0 ? "inactive-message" : "active-message"},
        {chatHeaderImage: activeChat?.image},
        {chatHeaderTitle: activeChat?.name},
        {message_name: "message"}
    ],
    loops: [
        {chatitem: testChatList()},
        {message: testMessageList_}
    ]
}}

