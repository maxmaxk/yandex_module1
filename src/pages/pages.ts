type Pages = {
  [key: string]: {
    title?: string,
    url: string
  }
}
export const pages: Pages = {
  main: { url: "/" },
  login: { title: "Логин", url: "/login.html" },
  registration: { title: "Регистрация", url: "/registration.html" },
  chartList: { title: "Лист чатов", url: "/chart-list.html" },
  profile: { title: "Настройки пользователя", url: "/profile.html" },
  page404: { title: "Страница 404", url: "/page404.html" },
  page500: { title: "Страница 500", url: "/page500.html" },
};
