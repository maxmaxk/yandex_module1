import { pages } from "../pages";
export const loginContextGetter = () => ({
    replaces: [
        {loginTitle: "Авторизация"},
        {submitTitle: "Вход"},
        {registrationTitle: "Создать профиль"},
        {registrationUrl: pages.registration}
    ],
    loops: [
        {item:[
            {
                title: "Имя пользователя",
                id: "login",
                type: "text"
            },
            {
                title:"Пароль",
                id: "password",
                type: "password"
            }
        ]}
    ]
});

