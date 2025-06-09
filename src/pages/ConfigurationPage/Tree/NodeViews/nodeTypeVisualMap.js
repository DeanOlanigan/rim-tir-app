import { DataObjectVisual } from "./DataObjectVisual";
import { DefaultVisual } from "./DefaultVisual";
import { FolderView } from "./FolderView";
import { RootVisual } from "./Root/RootVisual";
import { VariableVisual } from "./VariableVisual";

export const nodeTypeVisualMap = {
    root: RootVisual,
    variable: VariableVisual,
    folder: FolderView,
    dataObject: DataObjectVisual,
    default: DefaultVisual,
};
