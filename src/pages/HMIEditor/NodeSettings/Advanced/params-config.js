import { LuDroplet, LuEye, LuRuler, LuSquare, LuType } from "react-icons/lu";
import { LOCALE } from "../../constants";

export const PARAMS_CONFIG = {
    opacity: { label: LOCALE.opacity, icon: LuEye, type: "number" },
    fill: { label: LOCALE.fill, icon: LuDroplet, type: "color" },
    stroke: { label: LOCALE.stroke, icon: LuSquare, type: "color" },
    text: { label: LOCALE.text, icon: LuType, type: "string" },
    width: { label: LOCALE.width, icon: LuRuler, type: "number" },
    height: { label: LOCALE.height, icon: LuRuler, type: "number" },
};
