import { PARAM_DEFINITIONS } from "@/config/paramDefinitions";
import { validateVisability } from "@/utils/validator";
import {
    SelectInput,
    NumberInput,
    TextInput,
    SwitchInput,
    /* DebouncedTextarea, */
    EditableInput,
    DroppableInput,
    IpInput,
    HexInput,
} from "./index";
import {
    selectParamsErrors,
    useValidationStore,
} from "@/store/validation-store";
import { memo } from "react";
import { useShallow } from "zustand/shallow";

export const BaseInput = memo(function BaseInput(props) {
    const { value, id, inputParam, showLabel = false, ...rest } = props;
    const definition = PARAM_DEFINITIONS[inputParam];
    const errors = useValidationStore(
        useShallow((state) => selectParamsErrors(state, id, inputParam))
    );
    if (!definition) return null;
    if (definition.hidden) return null;

    const isVisible = validateVisability(definition.dependencies, id);
    if (!isVisible) return null;

    //const errors = validateParameter(definition, id, value, inputParam);
    //console.log(errors);

    const { type } = definition;

    switch (type) {
        case "boolean":
            return (
                <SwitchInput
                    targetKey={inputParam}
                    id={id}
                    value={value}
                    showLabel={showLabel}
                />
            );
        case "select":
            return (
                <SelectInput
                    id={id}
                    value={value}
                    targetKey={inputParam}
                    showLabel={showLabel}
                    {...rest}
                />
            );
        case "number":
            return (
                <NumberInput
                    targetKey={inputParam}
                    id={id}
                    value={value}
                    showLabel={showLabel}
                    errorText={errors}
                    {...rest}
                />
            );
        case "textarea":
            return (
                /* <DebouncedTextarea
                    targetKey={inputParam}
                    id={id}
                    value={value}
                    showLabel={showLabel}
                /> */
                <EditableInput targetKey={inputParam} id={id} value={value} />
            );
        case "drop":
            return (
                <DroppableInput
                    targetKey={inputParam}
                    id={id}
                    showLabel={showLabel}
                />
            );
        case "ip":
            return (
                <IpInput
                    targetKey={inputParam}
                    id={id}
                    value={value}
                    showLabel={showLabel}
                />
            );
        case "hex":
            return (
                <HexInput
                    targetKey={inputParam}
                    id={id}
                    value={value}
                    errorText={errors}
                    showLabel={showLabel}
                />
            );
        default:
            return (
                <TextInput
                    targetKey={inputParam}
                    id={id}
                    value={value}
                    showLabel={showLabel}
                />
            );
    }
});
