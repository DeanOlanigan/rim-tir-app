import { Field, HStack, Input } from "@chakra-ui/react";
import { useVariables } from "../use-variables";
import { VariableSelect } from "../VariableSelect";

export const WriteTag = ({ action, handleChange }) => {
    const { data: variables } = useVariables();

    return (
        <HStack gap={2} w={"100%"}>
            <Field.Root>
                <Field.Label fontSize="sm">Variable</Field.Label>
                <VariableSelect
                    variables={variables}
                    value={action.options.varId}
                    onChange={(v) => handleChange("varId", v)}
                />
            </Field.Root>
            <Field.Root>
                <Field.Label fontSize="sm">Value</Field.Label>
                <Input
                    size={"xs"}
                    value={action.options.value || ""}
                    onChange={(e) => handleChange("value", e.target.value)}
                    placeholder="1"
                    autoComplete="off"
                />
            </Field.Root>
        </HStack>
    );
};
