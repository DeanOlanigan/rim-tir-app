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
import { Field, Text } from "@chakra-ui/react";
import { configuratorConfig } from "@/store/configurator-config";
import { InfoTip } from "@/components/ui/toggle-tip";
import { useAuth } from "@/hooks/useAuth";
import { hasRight } from "@/utils/permissions";

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
    const { user } = useAuth();
    const errors = useValidationStore((state) =>
        state.errorsTree.get(id)?.get(inputParam),
    );
    const disabled = !hasRight(user, "config.editor");
    const renderer = inputRenderers[type] || inputRenderers.default;
    const inputProps = {
        id,
        targetkey: inputParam,
        value,
        errors,
        disabled,
        ...rest,
    };
    if (type === "enum") {
        const enumValues =
            configuratorConfig.nodePaths?.[path]?.settings?.[inputParam]
                ?.enumValues;
        inputProps.options = enumValues;
    }
    const info =
        configuratorConfig.nodePaths?.[path]?.settings?.[inputParam]?.info;

    return (
        <Field.Root maxW={"250px"} invalid={errors && errors.size !== 0}>
            {showLabel && (
                <Field.Label w={"100%"}>
                    <Text truncate>{label}</Text>
                    {info && (
                        <Field.RequiredIndicator
                            fallback={<InfoTip content={info} />}
                        />
                    )}
                </Field.Label>
            )}
            {renderer(inputProps)}
        </Field.Root>
    );
});
