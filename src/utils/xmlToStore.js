//import { useVariablesStore } from "../store/variables-store";

export function parseXmlToState(xmlString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "application/xml");

    const state = {};

    const root = xml.documentElement;
    state.version = Number(root.getAttribute("version") || 0);

    const cfg = xml.querySelector("ConfigInfo");
    state.configInfo = {
        name: cfg.getAttribute("name") || "",
        description: cfg.getAttribute("description") || "",
        date: cfg.getAttribute("date") || "",
        version: cfg.getAttribute("version") || "",
    };

    state.receive = [];
    state.send = [];
    state.variables = [];
    state.settings = {};

    function readNode(nodeElem, parentId = null) {
        const type = nodeElem.tagName.toLowerCase();
        const id = nodeElem.getAttribute("id");
        const name = nodeElem.getAttribute("name") || "";
        const subType = nodeElem.getAttribute("subType") || undefined;
        const variableId = nodeElem.getAttribute("variableId") || undefined;

        const settingElem = nodeElem.querySelector(":scope > Settings");
        const setting = {};
        if (settingElem) {
            settingElem.childNodes.forEach((ch) => {
                if (ch.nodeType === 1) {
                    const key =
                        ch.tagName.charAt(0).toLowerCase() +
                        ch.tagName.slice(1);
                    setting[key] = ch.textContent || "";
                }
            });
        }

        const childrenElems = Array.from(nodeElem.children).filter(
            (el) => el.tagName !== "Setting"
        );
        const children = childrenElems.map((el) => el.getAttribute("id"));

        state.settings[id] = {
            id,
            parentId,
            type,
            name,
            subType,
            variableId,
            setting: Object.keys(setting).length ? setting : undefined,
            children,
        };

        childrenElems.forEach((el) => readNode(el, id));

        return id;
    }

    const recvElems = xml.querySelectorAll(
        ":scope > Communication > Receive > *"
    );
    recvElems.forEach((el) => {
        const id = readNode(el, null);
        state.receive.push({ id });
    });

    const sndElems = xml.querySelectorAll(":scope > Communication > Send > *");
    sndElems.forEach((el) => {
        const id = readNode(el, null);
        state.send.push({ id });
    });

    const variableElems = xml.querySelectorAll(":scope > Variables > *");
    variableElems.forEach((el) => {
        const id = readNode(el, null);
        state.variables.push({ id });
    });

    return state;
}

export function uploadXmlFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
        const xml = reader.result;
        const newState = parseXmlToState(xml);
        console.log(newState);
    };
    reader.readAsText(file, "UTF-8");
}
