import { parse } from "uuid";
import { useVariablesStore } from "../store/variables-store";

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

    function parseValue(raw) {
        const text = raw.trim();
        // булевы
        if (/^(?:true|false)$/i.test(text)) {
            return text.toLowerCase() === "true";
        }
        // число (int или float)
        if (!isNaN(text) && text !== "") {
            if (text.includes(".")) return parseFloat(text);
            if (text.includes("x")) return parseInt(text, 16);
            return parseInt(text, 10);
        }
        // всё остальное — оставляем строкой
        return raw;
    }

    function readNode(nodeElem, parentId = null, stateArr = []) {
        const type =
            nodeElem.tagName.charAt(0).toLowerCase() +
            nodeElem.tagName.slice(1);
        const id = nodeElem.getAttribute("id");
        const name = nodeElem.getAttribute("name") || "";
        const subType = nodeElem.getAttribute("subType") || undefined;
        const variableId = nodeElem.getAttribute("variableId") || undefined;
        const ignoreChildren =
            nodeElem.getAttribute("ignoreChildren") === "true";

        const settingElem = nodeElem.querySelector(":scope > Settings");
        const setting = {};
        if (settingElem) {
            Array.from(settingElem.children).forEach((ch) => {
                const key =
                    ch.tagName.charAt(0).toLowerCase() + ch.tagName.slice(1);
                setting[key] = parseValue(ch.textContent || "");
            });
        }

        const childrenElems = Array.from(nodeElem.children).filter(
            (el) => el.tagName !== "Settings"
        );
        const children = childrenElems.map((el) => el.getAttribute("id"));

        state.settings[id] = {
            id,
            parentId,
            type,
            name,
            subType,
            ignoreChildren,
            setting: Object.keys(setting).length > 0 ? setting : undefined,
            children: Object.keys(children).length > 0 ? children : undefined,
        };
        if (type === "dataObject") {
            state.settings[id].variableId = variableId;
        }

        const treeNode = {
            id,
            type,
            subType,
            name: type === "dataObject" ? variableId : name,
            ignoreChildren,
            children: Object.keys(children).length > 0 ? [] : undefined,
        };
        childrenElems.forEach((el) => readNode(el, id, treeNode.children));
        stateArr.push(treeNode);
    }

    xml.querySelectorAll(":scope > Communication > Receive > *").forEach(
        (el) => {
            readNode(el, null, state.receive);
        }
    );

    xml.querySelectorAll(":scope > Communication > Send > *").forEach((el) => {
        readNode(el, null, state.send);
    });

    xml.querySelectorAll(":scope > Variables > *").forEach((el) => {
        readNode(el, null, state.variables);
    });

    Object.values(state.settings).forEach((node) => {
        if (node.variableId) {
            const vid = node.variableId;
            if (state.settings[vid]) {
                state.settings[vid].usedIn = node.id;
            }
        }
    });

    return state;
}

export function uploadXmlFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
        const xml = reader.result;
        const newState = parseXmlToState(xml);
        console.log(newState);
        useVariablesStore.setState(newState);
    };
    reader.readAsText(file, "UTF-8");
}
