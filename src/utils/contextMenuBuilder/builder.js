import {
    actions,
    makeCreateMenu,
    menuConfigNodeDefault,
    variablesPathConfig,
} from "./templates";

function isNodeAllowed(node, context) {
    const ctx = node.usedIn;
    if (!ctx) return true;
    return Array.isArray(ctx)
        ? ctx.includes(context) || ctx.includes("both")
        : ctx === context || ctx === "both";
}

function addDefaultItems(menu, nodeData) {
    if (nodeData.children || nodeData.type === "folder") {
        const items = [
            { type: "separator" },
            actions.rename,
            ...menuConfigNodeDefault,
            actions.paste,
        ];
        menu.push(...items);
    } else if (nodeData.type === "dataObject") {
        menu.push(...[actions.edit, ...menuConfigNodeDefault]);
    } else {
        menu.push(...[actions.rename, ...menuConfigNodeDefault]);
    }
}

function addMenuForFolder(
    baseNodes,
    node,
    context,
    nodeByPathEl,
    allowedContext
) {
    // BUG Ломается проверка при перетаскивании узлов
    if (nodeByPathEl.parentPath === "#") {
        for (const node of baseNodes) {
            const path = `#/${node.node}`;
            if (isNodeAllowed(node, allowedContext)) {
                pushMenuElem(node, context, path);
            }
        }
    }

    const parentNode = nodeByPathEl.parent;
    if (!parentNode || !Array.isArray(parentNode.children)) return;

    const typesSet = new Set();
    parentNode.children.forEach((child) => {
        if (child === node) return;
        if (isNodeAllowed(child, allowedContext)) {
            typesSet.add(child.node);
        }
    });

    typesSet.add(node.node);

    for (const type of typesSet) {
        const sibling = parentNode.children.find(
            (child) => child.node === type
        );
        if (sibling)
            pushMenuElem(
                sibling,
                context,
                nodeByPathEl.parentPath + "/" + type
            );
    }
}

function pushMenuElem(node, menu, path) {
    menu.push(
        makeCreateMenu({
            label: `Создать "${node.label}"`,
            nodeType: node.node,
            countPresets: node?.bulkCreation?.enabled
                ? node.bulkCreation?.presets
                : [1],
            basePath: path,
            icon: {
                name: node?.icon?.name,
                color: node?.icon?.color,
            },
        })
    );
}

function buildMenu(data, nodeByPath, context) {
    const menu = {};
    function traverse(nodes, parentPath = "#", node = null, type = null) {
        const key = parentPath + (node ? `/${node}` : "");
        if (type !== "folder") menu[key] = [];
        if (Array.isArray(nodes)) {
            for (const el of nodes) {
                if (!isNodeAllowed(el, context)) continue;
                const path = `${key}/${el.node}`;
                if (el.type === "folder") {
                    menu[path] = [];
                    addMenuForFolder(
                        data,
                        el,
                        menu[path],
                        nodeByPath[path],
                        context
                    );
                }
                pushMenuElem(el, menu[key], path);
                traverse(el.children, key, el.node, el.type);
            }
        }
        if (key !== "#") {
            addDefaultItems(menu[key], nodeByPath[key]);
        } else {
            menu[key].push(actions.paste);
        }
    }
    traverse(data);
    return menu;
}

export function createContextMenu(data, nodeByPath) {
    return {
        send: buildMenu(data, nodeByPath, "send"),
        receive: buildMenu(data, nodeByPath, "receive"),
        variables: variablesPathConfig,
    };
}
