import { pages } from "../pages";
export const page500Getter = () => ({
    replaces: [
        {unknownPageTitle: "500"},
        {unknownPageText: "Ой.. У нас что-то сломалось &#128551; Мы постараемся починить"},
        {backLinkText: "Назад к чатам"},
        {backLink: pages.chartList}
    ],
    loops: []
});

