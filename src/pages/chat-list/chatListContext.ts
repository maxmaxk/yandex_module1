import { state } from "../../common/state";

type PersonInfo = {
    name: string,
    image: string,
    lastMessageOwn: string,
    lastMessage: string,
    time: string,
    unreadCount: string,
    isActiveClass: string
}

export const testChatList = (): PersonInfo[] => [
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
  "Sean Connery"].map((person, key): PersonInfo => ({
  name: person,
  image: `./resources/${key}.jpg`,
  lastMessageOwn: key % 2 === 0 ? "Вы: " : "",
  lastMessage: ["Как дела?", "Говорят Голливуд уже не тот", "У нас сегодня дождь", "Приезжай в гости", "стикер"][key % 5],
  time: ["11:22", "Пн", "Вс", "11 апр 2022"][key % 4],
  unreadCount: ["", "1", "2"][key % 3],
  isActiveClass: state.activeChatId === key ? " active" : "",
}));

type DeliveryStatus = "message-none" | "message-sended" | "message-recieved" | "message-readed";
type MessageType = "date-message" | "companion-message" | "my-message";
type TestMessage = {
    type: MessageType,
    content: string,
    time?: string,
    status?: DeliveryStatus
}

export const testMessageList = (): TestMessage[] => [
  {
    type: "date-message",
    content: "сегодня",
  },
  {
    type: "companion-message",
    content: "Как дела, старичок?",
    time: "11:55",
    status: "message-none",
  },
  {
    type: "my-message",
    content: `Да ничего ${testChatList()[state.activeChatId]?.name.split(" ")[0]}, как у тебя?`,
    time: "11:57",
    status: "message-readed",
  },
  {
    type: "companion-message",
    content: "Да мне тут, прикинь, подогнали новую роль. Буду играть Ватмана, зацени костюмчик:",
    time: "12:03",
    status: "message-none",
  },
  {
    type: "companion-message",
    content: "<img src='./resources/25.jpg'",
    time: "12:04",
    status: "message-none",
  },
];

export const updateTestMessageList = (): TestMessage[] => {
  const updTestMessageList = testMessageList();
  if(state.newMessageText) {
    updTestMessageList.push({
      type: "my-message",
      content: state.newMessageText,
      time: "12:55",
      status: "message-readed",
    });
    updTestMessageList.push({
      type: "companion-message",
      content: "Старичок, я смогу получить это сообщение, когда ваш студент доделает интеграцию с бэком",
      time: "12:55",
      status: "message-none",
    });
  }
  return updTestMessageList;
};
