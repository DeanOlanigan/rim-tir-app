import { create } from "xmlbuilder";
import { useVariablesStore } from "@/store/variables-store";

function toTagName(key) {
    return key[0].toUpperCase() + key.slice(1);
}

function buildNode(xmlParent, node, settingsMap) {
    const tag = toTagName(node.type);

    const attrs = {};
    attrs.isIgnored = node.isIgnored;
    if (node.type !== "dataObject") attrs.name = node.name;
    attrs.id = node.id;
    if (node.rootId) attrs.rootId = node.rootId;
    if (node.parentId) attrs.parentId = node.parentId;
    if (node.path) attrs.path = node.path;
    if (node.node) attrs.node = node.node;

    const el = xmlParent.ele(tag, attrs);

    if (node.setting) {
        const settingsAttrs = {};
        for (const [key, value] of Object.entries(node.setting)) {
            if (key === "usedIn") continue;
            settingsAttrs[key] = value ?? "";
        }
        if (node.setting.usedIn) {
            settingsAttrs.sendId = node.setting.usedIn.send;
            settingsAttrs.receiveId = node.setting.usedIn.receive;
        }
        el.ele("Settings", settingsAttrs).up();
    }

    if (Array.isArray(node.children) && node.children?.length > 0) {
        const childrenEl = el.ele("Children");
        node.children.forEach((childId) => {
            const child = settingsMap[childId];
            if (child) buildNode(childrenEl, child, settingsMap);
        });
        childrenEl.up();
    }

    el.up();
}

function appendSection(parentEl, nodes, settingsMap) {
    nodes.forEach((node) => {
        const full = settingsMap[node.id];
        if (full) buildNode(parentEl, full, settingsMap);
    });
}

export function convertStateToXml(state) {
    const { send = [], receive = [], variables = [], settings = {} } = state;

    const doc = create("Root", { version: "1.0", encoding: "UTF-8" });

    doc.ele("ConfigInfo")
        .att("name", state.info.name)
        .att("description", state.info.description)
        .att("date", state.info.ts)
        .up();

    const comm = doc.ele("Communication");
    appendSection(comm, receive, settings);
    appendSection(comm, send, settings);
    comm.up();

    const vars = doc.ele("Variables");
    appendSection(vars, variables, settings);
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
    a.download = state.info.name + ".xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
