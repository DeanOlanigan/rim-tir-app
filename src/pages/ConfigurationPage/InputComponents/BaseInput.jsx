import { Field } from "../../../components/ui/field";
import { Input } from "@chakra-ui/react";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";
import {
    SelectInput,
    NumberInput,
    SwitchInput,
    DebouncedTextarea,
} from "./index";
import { memo } from "react";

export const BaseInput = memo(function BaseInput(props) {
    const { value, id, inputParam, showLabel = false } = props;
    const definition = PARAM_DEFINITIONS[inputParam];
    if (!definition) {
        return null;
    }
    const { label, type, ...rest } = definition;

    switch (type) {
        case "boolean":
            return (
                <SwitchInput
                    targetKey={inputParam}
                    id={id}
                    value={value}
                    label={label}
                    showLabel={showLabel}
                />
            );
        case "select":
            return (
                <SelectInput
                    id={id}
                    value={value}
                    targetKey={inputParam}
                    collection={rest.options}
                    label={label}
                    showLabel={showLabel}
                />
            );
        case "number":
            return (
                <NumberInput
                    targetKey={inputParam}
                    id={id}
                    value={value}
                    label={label}
                    showLabel={showLabel}
                />
            );
        case "textarea":
            return (
                <DebouncedTextarea
                    targetKey={inputParam}
                    id={id}
                    value={value}
                    label={label}
                    showLabel={showLabel}
                />
            );
        default:
            return (
                <Field label={showLabel ? label : ""} maxW={"250px"}>
                    <Input size={"xs"} />
                </Field>
            );
    }
});
