import { useVariablesStore } from "@/store/variables-store";
import { useConfigInfoStore } from "@/store/config-info-store";
import { validateAll } from "@/utils/validation";
import { configuratorConfig } from "@/utils/configurationParser";
import { useValidationStore } from "@/store/validation-store";

function toCamelCase(str) {
    return str[0].toLowerCase() + str.slice(1);
}

function parseValue(raw) {
    const text = raw.trim();
    // булевы
    if (/^(?:true|false)$/i.test(text)) {
        return text.toLowerCase() === "true";
    }
    // число (int или float)
    if (!isNaN(text) && text !== "") {
        if (text.includes(".")) return parseFloat(text);
        if (text.includes("x")) return text;
        return parseInt(text, 10);
    }
    // всё остальное — оставляем строкой
    return raw;
}

function getSettings(nodeElem, type) {
    const settingElem = nodeElem.querySelector(":scope > Settings");
    const setting = {};
    if (type === "variable") setting.usedIn = {};
    if (!settingElem) return null;

    for (const attr of settingElem.attributes) {
        if (attr.name === "sendId") setting.usedIn.send = attr.value;
        if (attr.name === "receiveId") setting.usedIn.receive = attr.value;
        setting[toCamelCase(attr.name)] = parseValue(attr.value || "");
    }

    return setting;
}

function getChilrenIds(childrenElems) {
    const children = [];
    if (!childrenElems) return children;
    for (const childElem of childrenElems.children) {
        children.push(childElem.getAttribute("id"));
    }
    return children;
}

function checkNode({ id, type, path, node, rootId, treeType }) {
    if (!id) throw new Error("Обнаружены некорректные узлы (нет id)");

    const isRoot = id === treeType;

    if (isRoot) {
        if (!path) {
            throw new Error("Корневой узел не имеет path");
        }
    } else {
        if (!type || !path || !node || !rootId) {
            throw new Error("Обнаружены некорректные узлы");
        }
    }
}

function readNode(
    nodeElem,
    parentId = null,
    stateArr = [],
    settings,
    treeType
) {
    const id = nodeElem.getAttribute("id");
    const name = nodeElem.getAttribute("name") || "";
    const type = toCamelCase(nodeElem.tagName);
    const path = nodeElem.getAttribute("path") || undefined;
    const node = nodeElem.getAttribute("node") || undefined;
    const rootId = nodeElem.getAttribute("rootId") || undefined;
    const isIgnored = nodeElem.getAttribute("isIgnored");

    checkNode({ id, type, path, node, rootId, treeType });

    const setting = getSettings(nodeElem, type);

    const childrenElems = nodeElem.querySelector(":scope > Children");
    const children = getChilrenIds(childrenElems);

    settings[id] = {
        id,
        type,
        name,
        isIgnored: isIgnored === "true",
        children,
    };
    if (parentId) settings[id].parentId = parentId;
    if (path) settings[id].path = path;
    if (node) settings[id].node = node;
    if (setting) settings[id].setting = setting;
    if (rootId) settings[id].rootId = rootId;

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
        settings[id].type === "dataObject" ||
        settings[id].type === "variable"
    ) {
        delete settings[id].children;
        delete treeNode.children;
    }

    if (childrenElems) {
        for (const childElem of childrenElems.children) {
            readNode(childElem, id, treeNode.children, settings, treeType);
        }
    }
    stateArr.push(treeNode);
}

export function parseXmlToState(xmlString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "application/xml");
    const cfg = xml.querySelector("ConfigInfo");
    if (!cfg) throw new Error("В файле отсутствует информация о конфигурации");

    const configInfo = {
        name: cfg?.getAttribute("name") || "",
        description: cfg?.getAttribute("description") || "",
        date: cfg?.getAttribute("date") || "",
        version: cfg?.getAttribute("version") || "",
    };

    const state = {
        send: [],
        receive: [],
        variables: [],
        settings: {},
    };

    const recv = xml.querySelector("#receive");
    if (!recv) throw new Error("В файле отсутствуют узлы приема");
    readNode(recv, null, state.receive, state.settings, "receive");

    const send = xml.querySelector("#send");
    if (!send) throw new Error("В файле отсутствуют узлы передачи");
    readNode(send, null, state.send, state.settings, "send");

    const vars = xml.querySelector("#variables");
    if (!vars) throw new Error("В файле отсутствуют переменные");
    readNode(vars, null, state.variables, state.settings, "variables");

    return { state, configInfo };
}

export async function uploadXmlFile(file) {
    const xml = await readFileAsText(file);
    return computeImport(xml, file.name);
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () =>
            reject(reader.error ?? new Error("File read error"));
        reader.onabort = () => reject(new Error("File read aborted"));
        reader.readAsText(file, "UTF-8");
    });
}

function computeImport(xml, filename) {
    const res = parseXmlToState(xml);
    const state = res.state;
    const configInfo = res.configInfo;
    if (!configInfo.name) {
        configInfo.name = filename.replace(/\.[^.]+$/i, "");
    }

    const draft = validateAll(state.settings, configuratorConfig);

    return { state, configInfo, draft };
}

export function applyImport({ state, configInfo, draft }) {
    useVariablesStore.setState(state);
    useConfigInfoStore.setState({ configInfo });
    useValidationStore.getState().clearErrors();
    useValidationStore.getState().applyDraft(draft);
}
