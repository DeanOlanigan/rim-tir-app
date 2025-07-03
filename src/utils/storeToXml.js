import { create } from "xmlbuilder";
import { useVariablesStore } from "@/store/variables-store";
import { useConfigInfoStore } from "@/store/config-info-store";

function toTagName(key) {
    return key[0].toUpperCase() + key.slice(1);
}

function buildNode(xmlParent, node, settingsMap) {
    const tag = toTagName(node.type);

    const attrs = {};
    attrs.id = node.id;
    attrs.name = node.name || "";
    if (node.parentId) attrs.parentId = node.parentId;
    if (node.rootId) attrs.rootId = node.rootId;
    if (node.subType) attrs.subType = node.subType;
    if (node.usedIn) attrs.usedIn = node.usedIn;
    if (node.variableId) attrs.variableId = node.variableId;
    attrs.isIgnored = node.isIgnored;

    const el = xmlParent.ele(tag, attrs);

    if (node.setting) {
        const settingsAttrs = {};
        for (const [key, value] of Object.entries(node.setting)) {
            settingsAttrs[key] = value ?? "";
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

function appendSection(parentEl, sectionName, nodes, settingsMap) {
    const sectionEl = parentEl.ele(sectionName);
    nodes.forEach((node) => {
        const full = settingsMap[node.id];
        if (full) buildNode(sectionEl, full, settingsMap);
    });
    sectionEl.up();
}

export function convertStateToXml(state, configInfo) {
    const { send = [], receive = [], variables = [], settings = {} } = state;

    const doc = create("Root", { version: "1.0", encoding: "UTF-8" });

    doc.ele("ConfigInfo")
        .att("name", configInfo.name)
        .att("description", configInfo.description)
        .att("date", configInfo.date)
        .att("version", configInfo.version)
        .up();

    const comm = doc.ele("Communication");
    appendSection(comm, "Receive", receive, settings);
    appendSection(comm, "Send", send, settings);
    comm.up();

    appendSection(doc, "Variables", variables, settings);

    return doc.end({ pretty: true });
}

export function downloadStateAsXml() {
    const state = useVariablesStore.getState();
    const configInfo = useConfigInfoStore.getState().configInfo;
    const xmlString = convertStateToXml(state, configInfo);
    const blob = new Blob([xmlString], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = configInfo.name + ".xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
