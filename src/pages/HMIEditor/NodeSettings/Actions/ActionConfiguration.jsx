import { Box, Field, HStack, Input, Stack, Textarea } from "@chakra-ui/react";
import { useVariables } from "../Advanced/use-variables";
import { VariableSelect } from "../Advanced/VariableSelect";

export const ActionConfiguration = ({ action, onUpdate }) => {
    const handleChange = (key, value) => {
        onUpdate({
            ...action,
            options: { ...action.options, [key]: value },
        });
    };

    // 1. WRITE_TAG
    if (action.type === "WRITE_TAG") {
        return <WriteTag action={action} handleChange={handleChange} />;
    }

    // 2. CONFIRMATION
    if (action.type === "CONFIRMATION") {
        return <Confirmation action={action} handleChange={handleChange} />;
    }

    // 3. NAVIGATE
    if (action.type === "NAVIGATE") {
        return <Navigate action={action} handleChange={handleChange} />;
    }

    if (action.type === "TOGGLE_TAG") {
        return <ToggleTag action={action} handleChange={handleChange} />;
    }

    return (
        <Box color="gray.500" fontSize="sm">
            No settings for this type.
        </Box>
    );
};

const ToggleTag = ({ action, handleChange }) => {
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

const WriteTag = ({ action, handleChange }) => {
    const { data: variables } = useVariables();
    const variable = variables.find((v) => v.id === action.options.varId);

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
                <Field.Label fontSize="sm">Value - {variable.type}</Field.Label>
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

const Confirmation = ({ action, handleChange }) => {
    return (
        <Stack gap={2} w={"100%"}>
            <Field.Root>
                <Field.Label fontSize="sm">Title</Field.Label>
                <Input
                    size={"xs"}
                    value={action.options.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    autoComplete="off"
                />
            </Field.Root>
            <Field.Root>
                <Field.Label fontSize="sm">Message</Field.Label>
                <Textarea
                    size={"xs"}
                    resize="none"
                    rows={1}
                    value={action.options.message || ""}
                    onChange={(e) => handleChange("message", e.target.value)}
                />
            </Field.Root>
            <HStack>
                <Field.Root>
                    <Field.Label fontSize="sm">Confirm</Field.Label>
                    <Input
                        size={"xs"}
                        value={action.options.confirmationText || ""}
                        onChange={(e) =>
                            handleChange("confirmationText", e.target.value)
                        }
                        autoComplete="off"
                    />
                </Field.Root>
                <Field.Root>
                    <Field.Label fontSize="sm">Cancel</Field.Label>
                    <Input
                        size={"xs"}
                        value={action.options.cancelText || ""}
                        onChange={(e) =>
                            handleChange("cancelText", e.target.value)
                        }
                        autoComplete="off"
                    />
                </Field.Root>
            </HStack>
        </Stack>
    );
};

const Navigate = ({ action, handleChange }) => {
    return (
        <Stack gap={2} w={"100%"}>
            <Field.Root>
                <Field.Label fontSize="sm">Screen / URL</Field.Label>
                <Input
                    size={"xs"}
                    value={action.options.target || ""}
                    onChange={(e) => handleChange("target", e.target.value)}
                    autoComplete="off"
                />
            </Field.Root>
        </Stack>
    );
};
