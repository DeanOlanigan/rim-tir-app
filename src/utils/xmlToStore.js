import { useVariablesStore } from "@/store/variables-store";
import { useConfigInfoStore } from "@/store/config-info-store";
import { validateAll } from "./validation/validator";

function toCamelCase(str) {
    return str[0].toLowerCase() + str.slice(1);
}

export function parseXmlToState(xmlString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "application/xml");

    const state = {};
    const cfg = xml.querySelector("ConfigInfo");
    const configInfo = {
        name: cfg?.getAttribute("name") || "",
        description: cfg?.getAttribute("description") || "",
        date: cfg?.getAttribute("date") || "",
        version: cfg?.getAttribute("version") || "",
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
        const id = nodeElem.getAttribute("id");
        const name = nodeElem.getAttribute("name") || "";
        const type = toCamelCase(nodeElem.tagName);
        const path = nodeElem.getAttribute("path") || undefined;
        const node = nodeElem.getAttribute("node") || undefined;
        const variableId = nodeElem.getAttribute("variableId") || undefined;
        const usedIn = nodeElem.getAttribute("usedIn") || undefined;
        const rootId = nodeElem.getAttribute("rootId") || undefined;
        const isIgnored = nodeElem.getAttribute("isIgnored");

        const settingElem = nodeElem.querySelector(":scope > Settings");
        let setting = undefined;
        if (settingElem) {
            setting = {};
            for (const attr of settingElem.attributes) {
                setting[toCamelCase(attr.name)] = parseValue(attr.value || "");
            }
        }

        const childrenElems = nodeElem.querySelector(":scope > Children");
        let children = [];
        if (childrenElems) {
            for (const childElem of childrenElems.children) {
                children.push(childElem.getAttribute("id"));
            }
        }

        state.settings[id] = {
            id,
            type,
            name,
            isIgnored: isIgnored === "true",
            children,
        };
        if (parentId) state.settings[id].parentId = parentId;
        if (path) state.settings[id].path = path;
        if (node) state.settings[id].node = node;
        if (setting) state.settings[id].setting = setting;
        if (variableId) state.settings[id].variableId = variableId;
        if (usedIn) state.settings[id].usedIn = usedIn;
        if (rootId) state.settings[id].rootId = rootId;

        const treeNode = {
            id,
            type,
            name,
            isIgnored: isIgnored === "true",
            children: [],
        };
        if (path) treeNode.path = path;
        if (node) treeNode.node = node;
        if (
            state.settings[id].type === "dataObject" ||
            state.settings[id].type === "variable"
        ) {
            delete state.settings[id].children;
            delete treeNode.children;
        }

        if (childrenElems) {
            for (const childElem of childrenElems.children) {
                readNode(childElem, id, treeNode.children);
            }
        }
        stateArr.push(treeNode);
    }

    xml.querySelectorAll("Communication > Receive > *").forEach((el) =>
        readNode(el, null, state.receive)
    );

    xml.querySelectorAll("Communication > Send > *").forEach((el) =>
        readNode(el, null, state.send)
    );

    xml.querySelectorAll("Variables > *").forEach((el) =>
        readNode(el, null, state.variables)
    );

    /* Object.values(state.settings).forEach((node) => {
        if (node.variableId) {
            const vid = node.variableId;
            if (state.settings[vid]) {
                state.settings[vid].usedIn = node.id;
            }
        }
    }); */

    return { state, configInfo };
}

export function uploadXmlFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
        const xml = reader.result;
        const { state, configInfo } = parseXmlToState(xml);
        configInfo.name = file.name.slice(0, -4);
        useConfigInfoStore.setState({ configInfo });
        useVariablesStore.setState(state);
        validateAll(state.settings);
    };
    reader.readAsText(file, "UTF-8");
}
