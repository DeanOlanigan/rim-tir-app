import { useVariablesStore } from "@/store/variables-store";

export function useBreadcrumb(id) {
    const settings = useVariablesStore((state) => state.settings);
    const breadcrumbs = [];
    let node = settings[id];
    while (node) {
        breadcrumbs.unshift(
            node.type === "dataObject" ? node.id.slice(0, 8) : node.name
        );
        node = node.parentId ? settings[node.parentId] : null;
    }
    return breadcrumbs;
}
