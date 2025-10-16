import { useVariablesStore } from "@/store/variables-store";
import { getSelectedIds } from "@/utils/contextMenuBuilder";
import { getParentId } from "@/utils/treeUtils";
import { useHotkeys } from "react-hotkeys-hook";

export function useTreeHostkeys(api) {
    // TODO: Унифицировать передачу хоткеев, в массиве не то, что в switch case
    const hkref = useHotkeys(
        ["ctrl+c", "ctrl+x", "ctrl+v", "ctrl+i"],
        (_, handler) => {
            if (!api) return;
            const ids = getSelectedIds(api);
            const treeType = api.props.treeType;
            switch (handler.keys.join("")) {
                case "c": {
                    if (ids.length === 0) return;
                    useVariablesStore.getState().copyNode(treeType, ids);
                    break;
                }
                case "v": {
                    const parentId = getParentId(api);
                    useVariablesStore.getState().pasteNode(treeType, parentId);
                    break;
                }
                case "x": {
                    if (ids.length === 0) return;
                    useVariablesStore.getState().cutNode(treeType, ids);
                    break;
                }
                case "i": {
                    if (ids.length === 0) return;
                    useVariablesStore.getState().toggleIgnore(ids);
                }
            }
        }
    );
    return hkref;
}
