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
import { Field, Group, Icon, Text } from "@chakra-ui/react";
import { configuratorConfig } from "@/utils/configurationParser";
import { LuTriangleAlert } from "react-icons/lu";

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
        targetKey: inputParam,
        value,
        ...rest,
    };
    if (type === "enum") {
        const enumValues =
            configuratorConfig.nodePaths[path]?.settings[inputParam]
                ?.enumValues;
        inputProps.options = enumValues;
    }

    return (
        <Field.Root maxW={"250px"} invalid={errors && errors.size !== 0}>
            {showLabel && (
                <Field.Label w={"100%"}>
                    <Text truncate>{label}</Text>
                </Field.Label>
            )}
            <Group w={"full"} maxW={"sm"}>
                {renderer(inputProps)}
                {errors && errors.size !== 0 && <ErrorSign errors={errors} />}
            </Group>
            {/* {errors &&
                errors.size !== 0 &&
                Array.from(errors)
                    .map(([, error]) => error.messages)
                    .flat()
                    .map((message, index) => (
                        <Field.ErrorText key={index}>{message}</Field.ErrorText>
                    ))} */}
        </Field.Root>
    );
});

const ErrorSign = ({ errors }) => {
    if (!errors) return null;
    const title = Array.from(errors)
        .map(([, error]) => error.messages)
        .flat()
        .join("\n");
    return (
        <Icon
            as={LuTriangleAlert}
            size={"sm"}
            color={"fg.error"}
            title={title}
        />
    );
};
