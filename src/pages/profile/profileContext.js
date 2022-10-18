export const profileContextGetter = () => ({
    replaces: [
        {profileTitle: "Князь Мышкин"},
        {profileImage: "./resources/25.jpg"},
        {profileChangeDataTitle: window.state.dataChangeMode ? "Сохранить данные" : "Изменить данные"},
        {dataChangeMode: window.state.dataChangeMode ? "" : " no-change-mode"},
        {isReadOnly: window.state.dataChangeMode ? "" : "readonly"},
        {profileChangePasswordTitle: "Изменить пароль"},
        {profileLogoutTitle: "Выйти"},
        {onChangeData: "onChangeData()"},
        {onLogout: "return onLogout(this)"}
    ],
    loops: [
        {item:[
            {
                title: "Имя",
                value: "Князь",
                name: "first_name",
                type: "text",
                isHidden: ""
            },
            {
                title: "Фамилия",
                value: "Мышкин",
                name: "second_name",
                type: "text",
                isHidden: ""
            },
            {
                title: "Логин",
                value: "batman",
                name: "login",
                type: "text",
                isHidden: ""
            },
            {
                title: "Имя в чате",
                value: "little_mouse",
                name: "display_name",
                type: "text",
                isHidden: ""
            },
            {
                title: "Электронная почта",
                value: "batman@hollywood.com",
                name: "email",
                type: "text",
                isHidden: ""
            },
            {
                title: "Телефон",
                value: "+1 (999) 999 99 99",
                name: "phone",
                type: "text",
                isHidden: ""
            },
            {
                title: "Старый пароль",
                value: "",
                name: "oldPassword",
                type: "password",
                isHidden: window.state.dataChangeMode ? "" : " hidden"
            },
            {
                title: "Новый пароль",
                value: "",
                name: "newPassword",
                type: "password",
                isHidden: window.state.dataChangeMode ? "" : " hidden"
            },
            {
                title: "Аватар",
                value: "",
                name: "avatar",
                type: "text",
                isHidden: window.state.dataChangeMode ? "" : " hidden"
            }
        ]}
    ]
});

