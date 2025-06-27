import {
    ComboboxInput,
    SelectInput,
    NumberInput,
    TextInput,
    SwitchInput,
    EditableInput,
    DroppableInput,
    IpInput,
    HexInput,
    NameInput,
} from "./index";
import {
    selectParamsErrors,
    useValidationStore,
} from "@/store/validation-store";
import { memo } from "react";
import { useShallow } from "zustand/shallow";
import { Field, Text } from "@chakra-ui/react";

// Следи за тем, что добавляешь в мапу. Проверяй пропсы.
const typeMap = {
    boolean: SwitchInput,
    select: SelectInput,
    number: NumberInput,
    numberF: NumberInput,
    textarea: EditableInput,
    drop: DroppableInput,
    ip: IpInput,
    hex: HexInput,
    text: TextInput,
    name: NameInput,
};

export const InputFactory = memo(function InputFactory(props) {
    const {
        type,
        id,
        inputParam,
        value,
        label,
        showLabel = false,
        ...rest
    } = props;
    const errors = useValidationStore(
        useShallow((state) => selectParamsErrors(state, id, inputParam))
    );
    const Component = typeMap[type] || TextInput;
    const noPortal = type === "select" && rest?.noPortal;
    const isF = type === "numberF";
    return (
        <Field.Root maxW={"250px"} invalid={errors && errors.length > 0}>
            {showLabel && (
                <Field.Label w={"100%"}>
                    <Text truncate>{label}</Text>
                </Field.Label>
            )}
            <Component
                id={id}
                targetKey={inputParam}
                value={value}
                {...(rest?.noPortal && { noPortal })}
                {...(type === "numberF" && { isF })}
            />
            {errors &&
                errors.length > 0 &&
                errors.map((error, index) => (
                    <Field.ErrorText key={index}>{error}</Field.ErrorText>
                ))}
        </Field.Root>
    );
});
