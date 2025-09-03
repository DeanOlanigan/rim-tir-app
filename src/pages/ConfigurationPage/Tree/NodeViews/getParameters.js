import { useParamValues } from "@/hooks/useParamValues";
import { configuratorConfig } from "@/utils/configurationParser";

export function useGetParameters(node) {
    const params = configuratorConfig.nodePaths[node.data.path]?.settings ?? {};
    const visibleSettingsKeys = Object.entries(params)
        .filter(([, value]) => value?.showInTree)
        .map(([key, value]) => ({
            param: key,
            label: value.label,
        }));
    return useParamValues(node.id, visibleSettingsKeys);
}

export function useGetParameters2(path) {
    const params = configuratorConfig.nodePaths[path]?.settings ?? {};
    const visibleSettingsKeys = Object.entries(params)
        .filter(([, value]) => value?.showInTree)
        .map(([key, value]) => ({ param: key, ...value }));
    return visibleSettingsKeys;
}
