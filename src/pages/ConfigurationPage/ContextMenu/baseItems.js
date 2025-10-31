import { configuratorConfig } from "@/store/configurator-config";

function getMeaningPath(api) {
    const { focusedNode } = api;
    const segments = [];
    let node = focusedNode;

    if (!node || node.data.type === "root") {
        segments.push("#");
    } else {
        segments.push(node.data.node);
        node = node.parent;

        while (node) {
            const { type, node: name } = node.data;
            if (type === "root") {
                segments.push("#");
                break;
            }

            if (type !== "folder") {
                segments.push(name);
            }
            node = node.parent;
        }
    }
    return segments.reverse().join("/");
}

export function getBaseItems(api) {
    const treeType = api.props.treeType;
    const path = getMeaningPath(api);
    console.log("getBaseItems", treeType, path);
    return configuratorConfig.contextMenu[treeType][path];
}
