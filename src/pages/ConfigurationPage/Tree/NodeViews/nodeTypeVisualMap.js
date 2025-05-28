import { DataObjectVisual } from "./DataObjectVisual";
import { DefaultVisual } from "./DefaultVisual";
import { RootVisual } from "./RootVisual";

export const nodeTypeVisualMap = {
    root: RootVisual,
    dataObject: DataObjectVisual,
    default: DefaultVisual,
};
