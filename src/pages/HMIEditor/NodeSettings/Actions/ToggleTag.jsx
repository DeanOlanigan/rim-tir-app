import { Field, HStack } from "@chakra-ui/react";
import { useVariables } from "../useVariables";
import { VariableSelect } from "../VariableSelect";
import { LOCALE } from "../../constants";

export const ToggleTag = ({ action, handleChange }) => {
    const { data } = useVariables();
    const variables = data?.data;

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
