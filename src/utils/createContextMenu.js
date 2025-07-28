import {
    menuConfigNodeDefault,
    variablesPathConfig,
} from "@/config/contextMenu";
import { iconsMap } from "@/config/icons";

function isNodeAllowed(node, context) {
    if (!node.usedIn) return true;
    if (Array.isArray(node.usedIn))
        return node.usedIn.includes(context) || node.usedIn.includes("both");
    return node.usedIn === context || node.usedIn === "both";
}

export function createContextMenu(data, nodeByPath) {
    function recursive(
        nodes,
        allowedContext,
        parent = "#",
        node = null,
        contextMenuPart = {}
    ) {
        const key = parent + (node ? `/${node}` : "");
        contextMenuPart[key] = [];
        if (Array.isArray(nodes)) {
            for (const nodeEl of nodes) {
                if (!isNodeAllowed(nodeEl, allowedContext)) continue;
                const path = `${key}/${nodeEl.node}`;
                if (nodeEl.type === "folder") {
                    contextMenuPart[path] = [];
                    addMenuForFolder(
                        nodeEl,
                        contextMenuPart[path],
                        path,
                        allowedContext
                    );
                }
                pushMenuElem(nodeEl, contextMenuPart[key], path);
                recursive(
                    nodeEl.children,
                    allowedContext,
                    key,
                    nodeEl.node,
                    contextMenuPart
                );
            }
            if (key !== "#") {
                contextMenuPart[key].push(...menuConfigNodeDefault);
            }
        } else {
            if (key !== "#") {
                contextMenuPart[key].push(...menuConfigNodeDefault.slice(1));
            }
        }
        return contextMenuPart;
    }

    function addMenuForFolder(node, context, path, allowedContext) {
        if (Array.isArray(node.allowedTypes)) {
            node.allowedTypes.forEach((fullPath) => {
                const nodeType = nodeByPath[fullPath];
                if (nodeType && isNodeAllowed(nodeType, allowedContext)) {
                    pushMenuElem(nodeType, context, path);
                }
            });
        }
    }

    function pushMenuElem(node, menu, path) {
        const icon = iconsMap[node?.icon?.name] || iconsMap["plus"];
        if (
            node?.bulkCreation?.enabled &&
            Array.isArray(node?.bulkCreation?.presets) &&
            node?.bulkCreation?.presets.length > 0
        ) {
            menu.push({
                type: "submenu",
                label: `Создать "${node.label}"...`,
                icon,
                children: node.bulkCreation.presets.map((count) => ({
                    type: `create-${node.node}-${count}`,
                    label: `Создать "${node.label}"... (${count})`,
                    icon,
                    action: (treeApi) =>
                        treeApi.create({
                            type: { nodeType: node.node, times: count, path },
                        }),
                })),
            });
        } else {
            menu.push({
                type: `create-${node.node}`,
                label:
                    node.type === "folder"
                        ? "Создать папку..."
                        : `Создать "${node.label}"...`,
                icon,
                action: (treeApi) =>
                    treeApi.create({
                        type: { nodeType: node.node, times: 1, path },
                    }),
            });
        }
    }

    const contextMenuSend = recursive(data, "send");
    const contextMenuReceive = recursive(data, "receive");
    const contextMenu = {
        send: contextMenuSend,
        receive: contextMenuReceive,
        variables: variablesPathConfig,
    };
    console.log("Контекстное меню", contextMenu);
    return contextMenu;
}
