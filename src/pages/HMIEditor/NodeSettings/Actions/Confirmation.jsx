import { Field, HStack, Input, Stack, Textarea } from "@chakra-ui/react";

export const Confirmation = ({ action, handleChange }) => {
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
