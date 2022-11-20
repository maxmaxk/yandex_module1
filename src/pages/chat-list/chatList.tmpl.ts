import { chatListLeftPanelTemplate } from "./chatListLeftPanel.tmpl";
import { chatListRigthPanelTemplate } from "./chatListRightPanel.tmpl";
import { promptPanelTemplate } from "../../components/prompt-panel/promptPanel.tmpl";

export const chatListTemplate = `
    ${chatListLeftPanelTemplate}
    ${chatListRigthPanelTemplate}
    ${promptPanelTemplate}
`;
