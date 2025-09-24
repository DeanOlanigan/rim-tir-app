import {
    ComboboxInput,
    SelectInput,
    NumberInput,
    TextInput,
    SwitchInput,
    NameInput,
} from "./index";
import { useValidationStore } from "@/store/validation-store";
import { memo } from "react";
import { Badge, Field, Text } from "@chakra-ui/react";
import { configuratorConfig } from "@/utils/configurationParser";

const inputRenderers = {
    drop: (props) => <ComboboxInput {...props} />,
    name: (props) => <NameInput {...props} />,
    number: (props) => <NumberInput {...props} />,
    float: (props) => <NumberInput {...props} isF />,
    enum: (props) => (
        <SelectInput
            {...props}
            options={props?.options}
            noPortal={props?.noPortal}
        />
    ),
    boolean: (props) => <SwitchInput {...props} />,
    string: (props) => <TextInput {...props} />,
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
    const errors = useValidationStore((state) =>
        state.errorsTree.get(id)?.get(inputParam)
    );

    const renderer = inputRenderers[type] || inputRenderers.default;
    const inputProps = {
        id,
        targetkey: inputParam,
        value,
        errors,
        ...rest,
    };
    if (type === "enum") {
        const enumValues =
            configuratorConfig.nodePaths[path]?.settings[inputParam]
                ?.enumValues;
        inputProps.options = enumValues;
    }
    const pref = configuratorConfig.nodePaths[path]?.settings[inputParam]?.pref;

    return (
        <Field.Root maxW={"250px"} invalid={errors && errors.size !== 0}>
            {showLabel && (
                <Field.Label w={"100%"}>
                    <Text truncate>{label}</Text>
                    {pref && (
                        <Field.RequiredIndicator
                            fallback={<Badge size={"xs"}>{pref}</Badge>}
                        />
                    )}
                </Field.Label>
            )}
            {renderer(inputProps)}
        </Field.Root>
    );
});
