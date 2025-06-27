import { PARAM_DEFINITIONS } from "@/config/paramDefinitions";
import { useVariablesStore } from "@/store/variables-store";
import { validateVisability } from "@/utils/validator";

export const InputController = ({
    settingParam,
    nodeId,
    value,
    empty = null,
    Factory,
    showLabel = false,
    ...props
}) => {
    const settings = useVariablesStore.getState().settings;
    const definition = PARAM_DEFINITIONS[settingParam];
    if (!definition || definition.hidden) return empty;
    const isVisible = validateVisability(
        definition.dependencies,
        nodeId,
        settings
    );
    if (!isVisible) return empty;
    return (
        <Factory
            type={definition.type}
            id={nodeId}
            inputParam={settingParam}
            value={value}
            label={definition.label}
            showLabel={showLabel}
            {...props}
        />
    );
};
