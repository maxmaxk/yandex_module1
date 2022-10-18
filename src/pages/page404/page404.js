import { pages } from "../pages";
export const page404Getter = () => ({
    replaces: [
        {unknownPageTitle: "404"},
        {unknownPageText: "Упс.. Такой страницы нет &#128533;"},
        {backLinkText: "Назад к чатам"},
        {backLink: pages.chartList}
    ],
    loops: []
});

