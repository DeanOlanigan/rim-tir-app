import { CONSTANT_VALUES } from "@/config/constants";
import {
    menuConfig,
    menuConfigNodeDefault,
    pasteNodeBtn,
} from "@/config/contextMenu";
import { useTestStore } from "@/store/test-store";

function getCurrentPath(api) {
    const path = [];

    function recursive(node) {
        if (node && node.data.type !== "root") {
            // TODO нужно переписать чуть позже
            const type = node.data.subType || node.data.type;
            if (type === "send" || type === "receive" || type === "variables") {
                path.push("#");
                return;
            }
            path.push(type);
            return recursive(node.parent);
        } else {
            path.push("#");
            return;
        }
    }
    recursive(api.focusedNode);
    return path.reverse().join("/");
}

export function getBaseItems(api) {
    const paths = useTestStore.getState().nodePaths;
    const contextMenu = useTestStore.getState().contextMenu;
    const treeType = api.props.treeType;
    const path = getCurrentPath(api);
    return contextMenu[treeType][path];
    /* if (
        treeType === CONSTANT_VALUES.TREE_TYPES.receive ||
        treeType === CONSTANT_VALUES.TREE_TYPES.send
    ) {
        return contextMenu[treeType][path];
    } else {
        return menuConfig.variables[api.focusedNode?.data.type];
    } */
}
