import { TREE_TYPES_SET } from "@/config/constants";
import { useVariablesStore } from "@/store/variables-store";
import { getParentId } from "@/utils/treeUtils";

export function getSelectedIds(treeApi) {
    if (treeApi.selectedIds.size > 1) return [...treeApi.selectedIds];
    if (TREE_TYPES_SET.has(treeApi.focusedNode.data.id)) return [];
    if (treeApi.focusedNode) return [treeApi.focusedNode.data.id];
    return [];
}

export const actionsMap = {
    edit: (api) => api.edit(api.focusedNode),
    delete: (api) => api.delete(getSelectedIds(api)),
    toggleIgnore: (api) => {
        const ids = getSelectedIds(api);
        useVariablesStore.getState().toggleIgnore(ids);
    },
    copy: (api) => {
        const ids = getSelectedIds(api);
        const treeType = api.props.treeType;
        useVariablesStore.getState().copyNode(treeType, ids);
    },
    cut: (api) => {
        const ids = getSelectedIds(api);
        const treeType = api.props.treeType;
        useVariablesStore.getState().cutNode(treeType, ids);
    },
    paste: (api) => {
        const treeType = api.props.treeType;
        const parentId = getParentId(api);
        useVariablesStore.getState().pasteNode(treeType, parentId);
    },
    create: (api, item) =>
        api.create({
            type: { node: item?.node, times: item?.count, path: item?.path },
        }),
};
