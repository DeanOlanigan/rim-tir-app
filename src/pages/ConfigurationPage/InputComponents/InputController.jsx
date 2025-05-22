import { PARAM_DEFINITIONS } from "@/config/paramDefinitions";
import { validateVisability } from "@/utils/validator";

export const InputController = ({
    inputType,
    inputId,
    value,
    empty = null,
    Factory,
    showLabel = false,
}) => {
    const definition = PARAM_DEFINITIONS[inputType];
    if (!definition || definition.hidden) return empty;
    const isVisible = validateVisability(definition.dependencies, inputId);
    if (!isVisible) return empty;
    return (
        <Factory
            type={definition.type}
            id={inputId}
            inputParam={inputType}
            value={value}
            label={definition.label}
            showLabel={showLabel}
        />
    );
};
