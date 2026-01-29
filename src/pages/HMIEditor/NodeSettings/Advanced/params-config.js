import { LuDroplet, LuEye, LuRuler, LuSquare, LuType } from "react-icons/lu";

export const PARAMS_CONFIG = {
    opacity: { label: "Opacity", icon: LuEye, type: "number" },
    fill: { label: "Fill", icon: LuDroplet, type: "color" },
    stroke: { label: "Stroke", icon: LuSquare, type: "color" },
    text: { label: "Text Content", icon: LuType, type: "string" },
    width: { label: "Width", icon: LuRuler, type: "number" },
    height: { label: "Height", icon: LuRuler, type: "number" },
};
