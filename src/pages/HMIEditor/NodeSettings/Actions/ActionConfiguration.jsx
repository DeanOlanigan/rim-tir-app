import { Box, Field, HStack, Input, Stack, Textarea } from "@chakra-ui/react";

export const ActionConfiguration = ({ action, onUpdate }) => {
    const handleChange = (key, value) => {
        onUpdate({
            ...action,
            options: { ...action.options, [key]: value },
        });
    };

    // 1. WRITE_TAG
    if (action.type === "WRITE_TAG") {
        return (
            <HStack gap={2} w={"100%"}>
                <Field.Root>
                    <Field.Label fontSize="sm">Tag ID</Field.Label>
                    <Input
                        size="sm"
                        value={action.options.varId || ""}
                        onChange={(e) => handleChange("varId", e.target.value)}
                        placeholder="pump_status"
                    />
                </Field.Root>
                <Field.Root>
                    <Field.Label fontSize="sm">Value</Field.Label>
                    <Input
                        size="sm"
                        value={action.options.value || ""}
                        onChange={(e) => handleChange("value", e.target.value)}
                        placeholder="1"
                    />
                </Field.Root>
            </HStack>
        );
    }

    // 2. CONFIRMATION
    if (action.type === "CONFIRMATION") {
        return (
            <Stack gap={2} w={"100%"}>
                <Field.Root>
                    <Field.Label fontSize="sm">Title</Field.Label>
                    <Input
                        size="sm"
                        value={action.options.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                    />
                </Field.Root>
                <Field.Root>
                    <Field.Label fontSize="sm">Message</Field.Label>
                    <Textarea
                        size="sm"
                        resize="none"
                        value={action.options.message || ""}
                        onChange={(e) =>
                            handleChange("message", e.target.value)
                        }
                    />
                </Field.Root>
            </Stack>
        );
    }

    // 3. NAVIGATE
    if (action.type === "NAVIGATE") {
        return (
            <Stack gap={2} w={"100%"}>
                <Field.Root>
                    <Field.Label fontSize="sm">Screen / URL</Field.Label>
                    <Input
                        size="sm"
                        value={action.options.target || ""}
                        onChange={(e) => handleChange("target", e.target.value)}
                    />
                </Field.Root>
            </Stack>
        );
    }

    return (
        <Box color="gray.500" fontSize="sm">
            No settings for this type.
        </Box>
    );
};
