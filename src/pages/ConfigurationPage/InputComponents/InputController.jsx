import { useVariablesStore } from "@/store/variables-store";
import { configuratorConfig } from "@/store/configurator-config";
import { validateVisibility } from "@/utils/validation/runners/validateVisibility";

export const InputController = ({
    settingParam,
    path,
    nodeId,
    value,
    empty = null,
    Factory,
    showLabel = false,
    ...props
}) => {
    const settings = useVariablesStore.getState().settings;
    const def = configuratorConfig.nodePaths?.[path].settings[settingParam];
    if (!def) return empty;
    const isVisible = validateVisibility(def.visibleIf, nodeId, settings);
    if (!isVisible) return empty;
    return (
        <Factory
            type={def.type}
            id={nodeId}
            inputParam={settingParam}
            path={path}
            value={value}
            label={def.label}
            showLabel={showLabel}
            {...props}
        />
    );
};
