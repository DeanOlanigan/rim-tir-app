import { LOCALE } from "../../constants";

export const EVENT_TYPES = [
    { type: "onClick", label: LOCALE.click },
    { type: "onContextMenu", label: LOCALE.rightClick },
    { type: "onDoubleClick", label: LOCALE.doubleClick },
    { type: "onMouseDown", label: LOCALE.mouseDown, disabled: true },
    { type: "onMouseUp", label: LOCALE.mouseUp, disabled: true },
];

export const ACTION_TYPES = [
    { type: "WRITE_TAG", label: LOCALE.writeTag },
    { type: "TOGGLE_TAG", label: LOCALE.toggleTag },
    { type: "NAVIGATE", label: LOCALE.navigate },
    { type: "CONFIRMATION", label: LOCALE.confirmation },
];
