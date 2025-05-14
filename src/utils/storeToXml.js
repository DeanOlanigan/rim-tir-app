//TODO добавить children и сделать параметры в settings в виде аргументов
import { create } from "xmlbuilder";
import { useVariablesStore } from "../store/variables-store";

function toTagName(key) {
    return key[0].toUpperCase() + key.slice(1);
}

function buildNode(xmlParent, node, settingsMap) {
    const tag = toTagName(node.type);
    const attrs = { id: node.id };
    if (node.name) attrs.name = node.name;
    if (node.subType) attrs.subType = node.subType;
    if (node.variableId) attrs.variableId = node.variableId;

    const el = xmlParent.ele(tag, attrs);

    if (node.setting) {
        const setEl = el.ele("Settings");
        Object.entries(node.setting).forEach(([key, value]) => {
            setEl.ele(toTagName(key), {}, value == null ? "" : value);
        });
    }

    if (Array.isArray(node.children)) {
        node.children.forEach((childId) => {
            const child = settingsMap[childId];
            if (child) buildNode(el, child, settingsMap);
        });
    }

    el.up();
}

export function convertStateToXml(state) {
    const { configInfo, send, receive, variables, settings, version } = state;

    const doc = create("State", { version: "1.0", encoding: "UTF-8" }).att(
        "version",
        String(version ?? 0)
    );

    doc.ele("ConfigInfo")
        .att("description", configInfo.description)
        .att("date", configInfo.date)
        .att("version", configInfo.version)
        .up();

    const comm = doc.ele("Communication");
    const recv = comm.ele("Receive");
    receive.forEach((node) => {
        const full = settings[node.id];
        if (full) buildNode(recv, full, settings);
    });
    recv.up();
    const snd = comm.ele("Send");
    send.forEach((node) => {
        const full = settings[node.id];
        if (full) buildNode(snd, full, settings);
    });
    snd.up();
    comm.up();

    const vars = doc.ele("Variables");
    variables.forEach((node) => {
        const full = settings[node.id];
        if (full) buildNode(vars, full, settings);
    });
    vars.up();

    return doc.end({ pretty: true });
}

export function downloadStateAsXml() {
    const state = useVariablesStore.getState();
    const xmlString = convertStateToXml(state);
    const blob = new Blob([xmlString], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = state.configInfo.name + ".xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
