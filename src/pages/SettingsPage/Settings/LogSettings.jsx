import {
    Card,
    Field,
    Fieldset,
    Heading,
    NumberInput,
    Switch,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";

export const LogSettings = () => {
    const [value, setValue] = useState("1");
    return (
        <>
            <Heading paddingBottom={"2"}>Лог файлы</Heading>
            <Card.Root variant={"elevated"}>
                <Card.Body>
                    <Fieldset.Root>
                        <Fieldset.Legend>
                            <Text fontSize={"lg"}>Параметры лог-файлов</Text>
                        </Fieldset.Legend>
                        <Fieldset.Content>
                            <Field.Root>
                                <Field.Label>Размер</Field.Label>
                                <NumberInput.Root
                                    w="100%"
                                    size={"sm"}
                                    value={value}
                                    onValueChange={(e) => setValue(e.value)}
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
        </>
    );
};
