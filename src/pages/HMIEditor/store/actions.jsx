import {
    LuHand,
    LuMousePointer2,
    LuMoveUpRight,
    LuSlash,
    LuSquare,
    LuType,
    LuZoomIn,
    LuZoomOut,
} from "react-icons/lu";

export const ACTIONS = {
    select: "select",
    hand: "hand",
    square: "square",
    circle: "circle",
    text: "text",
    arrow: "arrow",
    line: "line",
    zoomIn: "zoomIn",
    zoomOut: "zoomOut",
};

export const ACTION_OPTIONS = [
    {
        value: ACTIONS.select,
        label: "Select",
        icon: LuMousePointer2,
    },
    {
        value: ACTIONS.hand,
        label: "Hand",
        icon: LuHand,
    },
    {
        value: ACTIONS.square,
        label: "Square",
        icon: LuSquare,
    },
    {
        value: ACTIONS.text,
        label: "Text",
        icon: LuType,
    },
    {
        value: ACTIONS.arrow,
        label: "Arrow",
        icon: LuMoveUpRight,
    },
    {
        value: ACTIONS.line,
        label: "Line",
        icon: LuSlash,
    },
];

export const ZOOM_ACTIONS = [
    {
        value: ACTIONS.zoomIn,
        label: "Zoom In",
        icon: LuZoomIn,
    },
    {
        value: ACTIONS.zoomOut,
        label: "Zoom Out",
        icon: LuZoomOut,
    },
];
