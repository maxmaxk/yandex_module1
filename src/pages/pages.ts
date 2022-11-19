type Pages = {
  [key: string]: {
    title?: string,
    url: string
  }
}
export const pages: Pages = {
  login: { title: "Логин", url: "/" },
  registration: { title: "Регистрация", url: "/sign-up.html" },
  chatList: { title: "Лист чатов", url: "/messenger.html" },
  profile: { title: "Настройки пользователя", url: "/settings.html" },
  page404: { title: "Страница 404", url: "/page404.html" },
  page500: { title: "Страница 500", url: "/page500.html" },
};
