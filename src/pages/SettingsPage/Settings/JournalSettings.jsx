import {
    Card,
    Field,
    Fieldset,
    Heading,
    NumberInput,
    Stack,
    Switch,
    Text,
} from "@chakra-ui/react";

export const JournalSettings = () => {
    return (
        <>
            <Heading paddingBottom={"2"}>Журналы</Heading>
            <Stack>
                <Card.Root variant={"elevated"}>
                    <Card.Body>
                        <Fieldset.Root>
                            <Fieldset.Legend>
                                <Text fontSize={"lg"}>Журнал Событий</Text>
                            </Fieldset.Legend>
                            <Fieldset.Content>
                                <Field.Root>
                                    <Field.Label>Размер журнала</Field.Label>
                                    <NumberInput.Root
                                        w="100%"
                                        size={"sm"}
                                        min={"0.5"}
                                        max={"5"}
                                        formatOptions={{
                                            style: "unit",
                                            unit: "megabyte",
                                            unitDiplay: "long",
                                        }}
                                    >
                                        <NumberInput.Control />
                                        <NumberInput.Input />
                                    </NumberInput.Root>
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>Количество файлов</Field.Label>
                                    <NumberInput.Root
                                        w="100%"
                                        min={"1"}
                                        value={"1"}
                                        size={"sm"}
                                    >
                                        <NumberInput.Control />
                                        <NumberInput.Input />
                                    </NumberInput.Root>
                                </Field.Root>
                                <Switch.Root paddingTop="3">
                                    <Switch.HiddenInput />
                                    <Switch.Control />{" "}
                                    <Switch.Label>Сжатие</Switch.Label>
                                </Switch.Root>
                            </Fieldset.Content>
                        </Fieldset.Root>
                    </Card.Body>
                </Card.Root>
                <Card.Root variant={"elevated"}>
                    <Card.Body>
                        <Fieldset.Root>
                            <Fieldset.Legend>
                                <Text fontSize={"lg"}>Журнал ИТ</Text>
                            </Fieldset.Legend>
                            <Fieldset.Content>
                                <Field.Root>
                                    <Field.Label>Размер журнала</Field.Label>
                                    <NumberInput.Root
                                        w="100%"
                                        size={"sm"}
                                        min={"0.5"}
                                        max={"5"}
                                        formatOptions={{
                                            style: "unit",
                                            unit: "megabyte",
                                            unitDiplay: "long",
                                        }}
                                    >
                                        <NumberInput.Control />
                                        <NumberInput.Input />
                                    </NumberInput.Root>
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>Количество файлов</Field.Label>
                                    <NumberInput.Root
                                        w="100%"
                                        min={"1"}
                                        value={"1"}
                                        size={"sm"}
                                    >
                                        <NumberInput.Control />
                                        <NumberInput.Input />
                                    </NumberInput.Root>
                                </Field.Root>
                                <Switch.Root paddingTop="3">
                                    <Switch.HiddenInput />
                                    <Switch.Control />{" "}
                                    <Switch.Label>Сжатие</Switch.Label>
                                </Switch.Root>
                            </Fieldset.Content>
                        </Fieldset.Root>
                    </Card.Body>
                </Card.Root>
            </Stack>
        </>
    );
};
