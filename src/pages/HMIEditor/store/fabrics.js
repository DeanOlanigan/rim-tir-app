import { SHAPES } from "@/pages/HMIEditor/constants";

export const createDefaultPages = () => {
    return {
        "page-1": {
            id: "page-1",
            name: "Page 1",
            type: "SCREEN",
            rootIds: [],
            backgroundColor: "#1E1E1E",
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
        pageIdWithThumb: "page-1",
        pages: {
            "page-1": {
                id: "page-1",
                name: "Page 1",
                rootIds: [],
                type: "SCREEN",
                backgroundColor: "#1E1E1E",
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
        fill: "#c3c3c3FF",
        stroke: "#000000FF",
        strokeWidth: 0,
        lineJoin: "miter",
        lineCap: "butt",
        dashEnabled: false,
        dash: [0, 0],
        skewX: 0,
        skewY: 0,
        scaleX: 1,
        scaleY: 1,
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
