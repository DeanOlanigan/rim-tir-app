import { SHAPES } from "@/pages/HMIEditor/constants";

export function createGroupNode(id, bbox, childrenIds) {
    return {
        id,
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
            items: [],
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
