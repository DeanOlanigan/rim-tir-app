import {
    ComboboxInput,
    SelectInput,
    NumberInput,
    TextInput,
    SwitchInput,
    /* EditableInput,
    IpInput,
    HexInput, */
    NameInput,
} from "./index";
import {
    selectParamsErrors,
    useValidationStore,
} from "@/store/validation-store";
import { memo } from "react";
import { useShallow } from "zustand/shallow";
import { Field, Text } from "@chakra-ui/react";
import { configuratorConfig } from "@/utils/configurationParser";

// Следи за тем, что добавляешь в мапу. Проверяй пропсы.
/* const typeMap = {
    boolean: SwitchInput,
    select: SelectInput,
    number: NumberInput,
    numberF: NumberInput,
    textarea: EditableInput,
    drop: ComboboxInput,
    ip: IpInput,
    hex: HexInput,
    text: TextInput,
    name: NameInput,
    string: TextInput,
    enum: SelectInput,
}; */

const inputRenderers = {
    boolean: (props) => <SwitchInput {...props} />,
    number: (props) => <NumberInput {...props} />,
    float: (props) => <NumberInput {...props} isF />,
    string: (props) => <TextInput {...props} />,
    enum: (props) => (
        <SelectInput
            {...props}
            options={props?.options}
            noPortal={props?.noPortal}
        />
    ),
    drop: (props) => <ComboboxInput {...props} />,
    name: (props) => (
        <NameInput {...props} shoudValidate={props?.shoudValidate} />
    ),
    default: (props) => <TextInput {...props} />,
};

export const InputFactory = memo(function InputFactory(props) {
    const {
        type,
        id,
        inputParam,
        path,
        value,
        label,
        showLabel = false,
        ...rest
    } = props;
    const errors = useValidationStore(
        useShallow((state) => selectParamsErrors(state, id, inputParam))
    );

    const renderer = inputRenderers[type] || inputRenderers.default;
    const inputProps = {
        id,
        targetKey: inputParam,
        value,
        ...rest,
    };
    if (type === "name") {
        if (
            ["protocol", "interface", "variable"].includes(
                configuratorConfig.nodePaths[path]?.type
            )
        ) {
            inputProps.shoudValidate = true;
        }
    }
    if (type === "enum") {
        const enumValues =
            configuratorConfig.nodePaths[path]?.settings[inputParam]
                ?.enumValues;
        inputProps.options = enumValues;
    }

    return (
        <Field.Root maxW={"250px"} invalid={errors && errors.length > 0}>
            {showLabel && (
                <Field.Label w={"100%"}>
                    <Text truncate>{label}</Text>
                </Field.Label>
            )}
            {renderer(inputProps)}
            {errors &&
                errors.length > 0 &&
                errors.map((error, index) => (
                    <Field.ErrorText key={index}>{error}</Field.ErrorText>
                ))}
        </Field.Root>
    );
});
