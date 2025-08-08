import { useVariablesStore } from "@/store/variables-store";
import { configuratorConfig } from "@/utils/configurationParser";
import { validateVisability } from "@/utils/validation/validator";

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
    const def = configuratorConfig.nodePaths[path].settings[settingParam];
    if (!def) return empty;
    const isVisible = validateVisability(def.visibleIf, nodeId, settings);
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
