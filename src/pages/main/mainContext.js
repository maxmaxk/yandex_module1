import { pages } from "../pages";
export const mainContextGetter = () => ({
    replaces: [
        {mainTitle: "Макеты страниц"},
    ],
    loops: [
        {item: [
            {title: "Логин", url: `.${pages.login}`},
            {title: "Регистрация", url: `.${pages.registration}`},
            {title: "Лист чатов", url: `.${pages.chartList}`},
            {title: "Настройки пользователя", url: `.${pages.profile}`},
            {title: "Страница 404", url: `.${pages.page404}`},
            {title: "Страница 500", url: `.${pages.page500}`},
        ]}
    ]
});

