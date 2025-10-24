import { configuratorConfig } from "@/store/configurator-config";

export function useParameters(path) {
    const params = configuratorConfig.nodePaths?.[path]?.settings ?? {};
    const visibleSettingsKeys = Object.entries(params)
        .filter(([, value]) => value?.showInTree)
        .map(([key, value]) => ({ param: key, ...value }));
    return visibleSettingsKeys;
}
