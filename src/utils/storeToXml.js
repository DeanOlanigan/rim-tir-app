import { create } from "xmlbuilder";
import { useVariablesStore } from "../store/variables-store";

function toTagName(key) {
    return key[0].toUpperCase() + key.slice(1);
}

function buildNode(xmlParent, node, settingsMap) {
    const tag = toTagName(node.type);

    const attrs = {};
    if (node.id) attrs.id = node.id;
    if (node.name) attrs.name = node.name;
    if (node.subType) attrs.subType = node.subType;
    if (node.variableId) attrs.variableId = node.variableId;

    const el = xmlParent.ele(tag, attrs);

    if (node.setting) {
        const settingsAttrs = {};
        let description = "";
        let code = "";
        for (const [key, value] of Object.entries(node.setting)) {
            if (key === "description") {
                description = value ?? "";
                continue;
            }
            if (key === "luaExpression") {
                code = value ?? "";
                continue;
            }
            settingsAttrs[toTagName(key)] = value ?? "";
        }
        if (description) el.ele("Description").txt(description).up();
        if (code) el.ele("Code").dat(code).up();
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

export function convertStateToXml(state) {
    const {
        configInfo = {},
        send = [],
        receive = [],
        variables = [],
        settings = {},
        version = 0,
    } = state;

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
    appendSection(comm, "Receive", receive, settings);
    appendSection(comm, "Send", send, settings);
    comm.up();

    appendSection(doc, "Variables", variables, settings);

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
