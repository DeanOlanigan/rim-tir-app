import { Field, HStack } from "@chakra-ui/react";
import { useVariables } from "../use-variables";
import { VariableSelect } from "../VariableSelect";

export const ToggleTag = ({ action, handleChange }) => {
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
        </HStack>
    );
};
