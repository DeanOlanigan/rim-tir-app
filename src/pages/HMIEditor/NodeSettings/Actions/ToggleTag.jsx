import { Field, HStack } from "@chakra-ui/react";
import { useVariables } from "../use-variables";
import { VariableSelect } from "../VariableSelect";
import { LOCALE } from "../../constants";

export const ToggleTag = ({ action, handleChange }) => {
    const { data: variables } = useVariables();

    return (
        <HStack gap={2} w={"100%"}>
            <Field.Root>
                <Field.Label fontSize="sm">{LOCALE.variable}</Field.Label>
                <VariableSelect
                    variables={variables}
                    value={action.options.varId}
                    onChange={(v) => handleChange("varId", v)}
                />
            </Field.Root>
        </HStack>
    );
};
