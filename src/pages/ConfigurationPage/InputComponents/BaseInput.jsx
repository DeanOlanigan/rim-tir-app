import { Switch } from "../../../components/ui/switch";
import { Field } from "../../../components/ui/field";
import {
    SelectRoot,
    SelectTrigger,
    SelectValueText,
    SelectContent,
    SelectItem,
    SelectLabel
} from "../../../components/ui/select";
import {
    NumberInputField,
    NumberInputRoot
} from "../../../components/ui/number-input";
import { Input } from "@chakra-ui/react";

export const BaseInput = ({definition, value, showLabel = false}) => {
    if (!definition) {
        return null;
    }

    const { label, type, ...rest } = definition;

    switch (type) {
    case "boolean":
        return (
            <Field label={showLabel ? label : ""} w={"fit"}>
                <Switch size={"lg"} checked={Boolean(value)}>{!showLabel ? label : ""}</Switch>
            </Field>
        );
    case "select":
        return (
            <SelectRoot size={"xs"} collection={rest.options} maxW={"250px"}>
                {showLabel && <SelectLabel>{label}</SelectLabel>}
                <SelectTrigger>
                    <SelectValueText
                        placeholder={`Выберите ${label.toLowerCase()}`}
                    />
                </SelectTrigger>
                <SelectContent>
                    {rest?.options?.items.map((row) => (
                        <SelectItem item={row} key={row.value}>
                            {row.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectRoot>
        );
    case "number":
        return (
            <Field label={showLabel ? label : ""} maxW={"250px"}>
                <NumberInputRoot
                    defaultValue={rest.defaultValue}
                    size={"xs"}
                    w={"100%"}
                >
                    <NumberInputField  placeholder={`Введите ${label.toLowerCase()}`}/>
                </NumberInputRoot>
            </Field>
        );
    default:
        return (
            <Field label={showLabel ? label : ""} maxW={"250px"}>
                <Input size={"xs"}/>
            </Field>
        );
    };
};
