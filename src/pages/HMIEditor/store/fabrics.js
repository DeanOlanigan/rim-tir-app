import { SHAPES } from "@/pages/HMIEditor/constants";

export const createDefaultPages = () => {
    return {
        "page-1": {
            id: "page-1",
            name: "Page 1",
            type: "SCREEN",
            rootIds: [],
            backgroundColor: "#254e25ff",
        },
    };
};

export const createInitial = () => {
    return {
        varIndex: {},
        nodeIndex: {},
        meta: {
            mode: "new",
            filename: "untitled",
            isDirty: false,
            treeRev: 0,
        },
        nodes: {},
        activePageId: "page-1",
        pages: {
            "page-1": {
                id: "page-1",
                name: "Page 1",
                rootIds: [],
                type: "SCREEN",
                backgroundColor: "#254e25ff",
            },
        },
        projectName: "New project",
        selectedIds: [],
    };
};

export function createDefaultNode(id) {
    return {
        id,
        parentId: null,
        fill: "#c3c3c3",
        stroke: "#000000",
        strokeWidth: 0,
        lineJoin: "miter",
        lineCap: "butt",
        dashEnabled: false,
        dash: [0, 0],
        opacity: 1,
        visible: true,
        rotation: 0,
        bindings: { globalVarId: null, byProp: {} },
        events: {
            onClick: [],
            onContextMenu: [],
            onDoubleClick: [],
            onMouseDown: [],
            onMouseUp: [],
        },
    };
}

export function createGroupNode(id, bbox, childrenIds, parentId = null) {
    return {
        id,
        parentId,
        type: SHAPES.group,
        name: "Группа",
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height,
        opacity: 1,
        visible: true,
        rotation: 0,
        childrenIds,
        bindings: {
            globalVarId: null,
            byProp: {},
        },
        events: {
            onClick: [],
            onContextMenu: [],
            onDoubleClick: [],
            onMouseDown: [],
            onMouseUp: [],
        },
    };
}
