export const registrationContextGetter = () => ({
    replaces: [
        {registrationTitle: "Регистрация"},
        {submitTitle: "Зарегистрироваться"},
    ],
    loops: [
        {item:[
            {
                title: "Имя",
                id: "first_name",
                type: "text"
            },
            {
                title: "Фамилия",
                id: "second_name",
                type: "text"
            },
            {
                title: "Логин",
                id: "login",
                type: "text"
            },
            {
                title: "Электронная почта",
                id: "email",
                type: "text"
            },
            {
                title:"Пароль",
                id: "password",
                type: "password"
            },
            {
                title: "Телефон",
                id: "phone",
                type: "text"
            }
        ]}
    ]
});

