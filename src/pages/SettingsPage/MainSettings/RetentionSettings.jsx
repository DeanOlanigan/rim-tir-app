import { useAuth } from "@/hooks/useAuth";
import { hasRight } from "@/utils/permissions";
import {
    Card,
    Field,
    Fieldset,
    Heading,
    NumberInput,
    SimpleGrid,
    Switch,
    Text,
} from "@chakra-ui/react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

const LABELS = {
    "journal.events": "Журнал событий",
    "journal.telemetry": "Журнал телеметрии",
    logs: "Лог-файлы",
};

const RETENTION_RIGHTS = {
    "journal.events": "settings.journal.edit",
    "journal.telemetry": "settings.journal.edit",
    logs: "settings.logs.edit",
};

export const RetentionSettings = () => {
    const { user } = useAuth();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const { fields } = useFieldArray({
        control,
        name: "retention",
    });

    return (
        <>
            <Heading>Хранение данных</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                {fields
                    .filter((item) =>
                        hasRight(user, RETENTION_RIGHTS[item.name]),
                    )
                    .map((item, index) => {
                        const itemErrors = errors.retention?.[index];

                        return (
                            <Card.Root variant="elevated" key={item.id}>
                                <Card.Body>
                                    <Fieldset.Root>
                                        <Fieldset.Legend>
                                            <Text fontSize="lg">
                                                {LABELS[item.name]}
                                            </Text>
                                        </Fieldset.Legend>

                                        <Fieldset.Content>
                                            <Field.Root
                                                invalid={!!itemErrors?.size}
                                            >
                                                <Field.Label>
                                                    Размер, MB
                                                </Field.Label>
                                                <Controller
                                                    name={`retention.${index}.size`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <NumberInput.Root
                                                            value={
                                                                field.value?.toString() ??
                                                                ""
                                                            }
                                                            onValueChange={(
                                                                e,
                                                            ) =>
                                                                field.onChange(
                                                                    e.value,
                                                                )
                                                            }
                                                            w="100%"
                                                            min="0.5"
                                                            step="0.5"
                                                            size="xs"
                                                        >
                                                            <NumberInput.Control />
                                                            <NumberInput.Input />
                                                        </NumberInput.Root>
                                                    )}
                                                />
                                                <Field.ErrorText>
                                                    {itemErrors?.size?.message}
                                                </Field.ErrorText>
                                            </Field.Root>

                                            <Field.Root
                                                invalid={!!itemErrors?.files}
                                            >
                                                <Field.Label>
                                                    Количество файлов
                                                </Field.Label>
                                                <Controller
                                                    name={`retention.${index}.files`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <NumberInput.Root
                                                            value={
                                                                field.value?.toString() ??
                                                                ""
                                                            }
                                                            onValueChange={(
                                                                e,
                                                            ) =>
                                                                field.onChange(
                                                                    e.value,
                                                                )
                                                            }
                                                            w="100%"
                                                            min="1"
                                                            size="xs"
                                                            allowMouseWheel
                                                        >
                                                            <NumberInput.Control />
                                                            <NumberInput.Input />
                                                        </NumberInput.Root>
                                                    )}
                                                />
                                                <Field.ErrorText>
                                                    {itemErrors?.files?.message}
                                                </Field.ErrorText>
                                            </Field.Root>

                                            <Controller
                                                name={`retention.${index}.archive`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Switch.Root
                                                        checked={field.value}
                                                        onCheckedChange={(e) =>
                                                            field.onChange(
                                                                e.checked,
                                                            )
                                                        }
                                                    >
                                                        <Switch.HiddenInput />
                                                        <Switch.Control />
                                                        <Switch.Label>
                                                            Сжатие
                                                        </Switch.Label>
                                                    </Switch.Root>
                                                )}
                                            />
                                        </Fieldset.Content>
                                    </Fieldset.Root>
                                </Card.Body>
                            </Card.Root>
                        );
                    })}
            </SimpleGrid>
        </>
    );
};
