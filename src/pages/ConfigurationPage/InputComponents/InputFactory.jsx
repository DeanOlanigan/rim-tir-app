import {
    ComboboxInput,
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
import { Field } from "@chakra-ui/react";

// Следи за тем, что добавляешь в мапу. Проверяй пропсы.
const typeMap = {
    boolean: SwitchInput,
    select: SelectInput,
    number: NumberInput,
    textarea: EditableInput,
    drop: DroppableInput,
    ip: IpInput,
    hex: HexInput,
    text: TextInput,
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
    console.log("RENDER InputFactory");
    const errors = useValidationStore(
        useShallow((state) => selectParamsErrors(state, id, inputParam))
    );

    const Component = typeMap[type] || TextInput;
    return (
        <Field.Root maxW={"250px"} invalid={errors && errors.length > 0}>
            {showLabel && <Field.Label>{label}</Field.Label>}
            <Component id={id} targetKey={inputParam} value={value} {...rest} />
            {errors &&
                errors.length > 0 &&
                errors.map((error, index) => (
                    <Field.ErrorText key={index}>{error}</Field.ErrorText>
                ))}
        </Field.Root>
    );
});
