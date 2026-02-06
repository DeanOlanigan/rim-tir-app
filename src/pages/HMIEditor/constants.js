import {
    LuCircle,
    LuGroup,
    LuHexagon,
    LuMoveUpRight,
    LuSlash,
    LuSquare,
    LuType,
} from "react-icons/lu";

export const DEFAULT_GRID_SIZE = 10;
export const SCROLL_STRENGTH = 25;
export const DEFAULT_MIN_ZOOM = 0.2;
export const DEFAULT_MAX_ZOOM = 30;
export const FIT_PADDING = 0.85; // 85% of canvas
export const ROTATION_SNAPS = [0, 45, 90, 135, 180, 225, 270, 315, 360];
export const ROTATION_SNAP_TOLERANCE = 15;
export const GRID_OPACITY = 0.3;
export const GRID_MAJOR_STEP = 25;
export const ZOOM_PERCENTAGE_STEP = 0.1;
export const ACTIONS = {
    select: "select",
    vertex: "vertex",
    hand: "hand",
    square: "square",
    polygon: "polygon",
    ellipse: "ellipse",
    text: "text",
    arrow: "arrow",
    line: "line",
    zoomIn: "zoomIn",
    zoomOut: "zoomOut",
};
export const SHAPES = {
    rect: "rect",
    polygon: "polygon",
    ellipse: "ellipse",
    text: "text",
    line: "line",
    arrow: "arrow",
    group: "group",
};
export const SHAPES_WITH_SETTINGS = new Set([
    SHAPES.rect,
    SHAPES.polygon,
    SHAPES.ellipse,
    SHAPES.text,
    SHAPES.line,
    SHAPES.arrow,
    SHAPES.group,
]);
export const SHAPES_NAMES = {
    [SHAPES.rect]: "Rectangle",
    [SHAPES.polygon]: "Polygon",
    [SHAPES.ellipse]: "Ellipse",
    [SHAPES.text]: "Text",
    [SHAPES.line]: "Line",
    [SHAPES.arrow]: "Arrow",
    [SHAPES.group]: "Group",
};
export const SHAPES_ICONS = {
    [SHAPES.rect]: LuSquare,
    [SHAPES.polygon]: LuHexagon,
    [SHAPES.ellipse]: LuCircle,
    [SHAPES.text]: LuType,
    [SHAPES.line]: LuSlash,
    [SHAPES.arrow]: LuMoveUpRight,
    [SHAPES.group]: LuGroup,
};
export const MAX_POLY_CORNERS = 12;
export const HOTKEYS = {
    selectTool: { hotkey: "v", keyLabel: "V" },
    handTool: { hotkey: "h", keyLabel: "H" },
    squareTool: { hotkey: "r", keyLabel: "R" },
    lineTool: { hotkey: "l", keyLabel: "L" },
    arrowTool: { hotkey: "shift+l", keyLabel: "Shift+L" },
    textTool: { hotkey: "t", keyLabel: "T" },
    snapToGrid: { hotkey: "ctrl+shift+quote", keyLabel: "Ctrl+Shift+'" },
    toggleGrid: { hotkey: "ctrl+quote", keyLabel: "Shift+'" },
    openGridDialog: { hotkey: "ctrl+alt+quote", keyLabel: "Ctrl+Alt+'" },
    openProject: { hotkey: "ctrl+p", keyLabel: "Ctrl+P" },
    toggleViewOnly: { hotkey: "shift+v", keyLabel: "Shift+V" },
    zoomPlus: { hotkey: "ctrl+equal, ctrl+add", keyLabel: "Ctrl++" },
    zoomMinus: { hotkey: "ctrl+minus, ctrl+subtract", keyLabel: "Ctrl+-" },
    zoomReset: { hotkey: "ctrl+0", keyLabel: "Ctrl+0" },
    fitToFrame: { hotkey: "shift+1", keyLabel: "Shift+1" },
    zoomToSelection: { hotkey: "shift+2", keyLabel: "Shift+2" },
    delete: { hotkey: "backspace, delete", keyLabel: "⌫" },
    duplicate: { hotkey: "ctrl+d", keyLabel: "Ctrl+D" },
    moveToTop: { hotkey: "bracketright", keyLabel: "]" },
    moveToBottom: { hotkey: "bracketleft", keyLabel: "[" },
    moveDown: { hotkey: "ctrl+bracketleft", keyLabel: "Ctrl+[" },
    moveUp: { hotkey: "ctrl+bracketright", keyLabel: "Ctrl+]" },
    minimizeUi: { hotkey: "ctrl+shift+backslash", keyLabel: "Ctrl+Shift+\\" },
    pageUp: { hotkey: "pageup", keyLabel: "PageUp" },
    pageDown: { hotkey: "pagedown", keyLabel: "PageDown" },
    selectAll: { hotkey: "ctrl+a", keyLabel: "Ctrl+A" },
    deselectAll: { hotkey: "esc", keyLabel: "Esc" },
    group: { hotkey: "ctrl+g", keyLabel: "Ctrl+G" },
    ungroup: { hotkey: "ctrl+shift+g", keyLabel: "Ctrl+Shift+G" },
};
export const LAYERS_OPS = {
    moveUp: "moveUp",
    moveDown: "moveDown",
    moveToTop: "moveToTop",
    moveToBottom: "moveToBottom",
};
