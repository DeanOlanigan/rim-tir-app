import {
    Card,
    Field,
    Fieldset,
    NumberInput,
    Switch,
    Text,
} from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";

export const RetentionPolicyCard = ({ name, label }) => {
    const { control } = useFormContext();

    const {
        field: sizeField,
        fieldState: { error: sizeError },
    } = useController({
        name: `retention.${name}.size`,
        control,
    });

    const {
        field: filesField,
        fieldState: { error: filesError },
    } = useController({
        name: `retention.${name}.files`,
        control,
    });

    const { field: archiveField } = useController({
        name: `retention.${name}.archive`,
        control,
    });

    return (
        <Card.Root variant="elevated">
            <Card.Body>
                <Fieldset.Root>
                    <Fieldset.Legend>
                        <Text fontSize="lg">{label}</Text>
                    </Fieldset.Legend>

                    <Fieldset.Content>
                        <Field.Root invalid={!!sizeError}>
                            <Field.Label>Размер, MB</Field.Label>
                            <NumberInput.Root
                                value={sizeField.value?.toString() ?? ""}
                                onValueChange={(e) =>
                                    sizeField.onChange(e.value)
                                }
                                w="100%"
                                min="0.5"
                                step="0.5"
                                size="xs"
                            >
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>
                            <Field.ErrorText>
                                {sizeError?.message}
                            </Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!filesError}>
                            <Field.Label>Количество файлов</Field.Label>

                            <NumberInput.Root
                                value={filesField.value?.toString() ?? ""}
                                onValueChange={(e) =>
                                    filesField.onChange(e.value)
                                }
                                w="100%"
                                min="1"
                                size="xs"
                                allowMouseWheel
                            >
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>

                            <Field.ErrorText>
                                {filesError?.message}
                            </Field.ErrorText>
                        </Field.Root>
                        <Switch.Root
                            checked={!!archiveField.value}
                            onCheckedChange={(e) =>
                                archiveField.onChange(e.checked)
                            }
                        >
                            <Switch.HiddenInput />
                            <Switch.Control />
                            <Switch.Label>Сжатие</Switch.Label>
                        </Switch.Root>
                    </Fieldset.Content>
                </Fieldset.Root>
            </Card.Body>
        </Card.Root>
    );
};
