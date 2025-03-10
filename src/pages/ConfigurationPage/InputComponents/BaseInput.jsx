import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";
import {
    SelectInput,
    NumberInput,
    TextInput,
    SwitchInput,
    DebouncedTextarea,
    DroppableInput,
} from "./index";
import { memo } from "react";

export const BaseInput = memo(function BaseInput(props) {
    const { value, id, inputParam, showLabel = false } = props;
    const definition = PARAM_DEFINITIONS[inputParam];
    if (!definition) {
        return null;
    }
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
                />
            );
        case "number":
            return (
                <NumberInput
                    targetKey={inputParam}
                    id={id}
                    value={value}
                    showLabel={showLabel}
                />
            );
        case "textarea":
            return (
                <DebouncedTextarea
                    targetKey={inputParam}
                    id={id}
                    value={value}
                    showLabel={showLabel}
                />
            );
        case "drop":
            return (
                <DroppableInput
                    targetKey={inputParam}
                    id={id}
                    value={value}
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
