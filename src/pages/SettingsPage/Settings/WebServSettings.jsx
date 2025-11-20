import {
    Heading,
    NumberInput,
    Field,
    Input,
    Fieldset,
    Card,
    Button,
    Switch,
    FileUpload,
    IconButton,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuUpload } from "react-icons/lu";

export const ServerSettings = () => {
    const [protocol, setProtocol] = useState(false);
    console.log(protocol);
    return (
        <>
            <Heading paddingBottom={"2"}>Web Сервер</Heading>
            <Card.Root variant={"elevated"}>
                <Card.Body>
                    <Fieldset.Root>
                        <Fieldset.Legend>
                            <Text fontSize={"lg"}>Параметры Web Сервера</Text>
                        </Fieldset.Legend>
                        <Fieldset.Content>
                            <Field.Root>
                                <Field.Label>Порт</Field.Label>
                                <NumberInput.Root
                                    pattern={"[0-9]*"}
                                    allowMouseWheel="true"
                                    min={"50"}
                                    value="5173"
                                    w="100%"
                                    inputMode={"numeric"}
                                    size={"sm"}
                                >
                                    <NumberInput.Control />
                                    <NumberInput.Input />
                                </NumberInput.Root>
                                <Field.ErrorText>
                                    НЕ ПРАВИЛЬНО БЛИН
                                </Field.ErrorText>
                            </Field.Root>
                            <Field.Root>
                                <Field.Label>Время сессии</Field.Label>
                                <Input size={"sm"} type="time" />
                            </Field.Root>
                        </Fieldset.Content>
                    </Fieldset.Root>
                    <Switch.Root
                        paddingTop="3"
                        value={protocol}
                        onCheckedChange={(e) => setProtocol(e.checked)}
                    >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label>HTTPS</Switch.Label>
                    </Switch.Root>
                    {protocol && (
                        <FileUpload.Root paddingTop="3">
                            <FileUpload.HiddenInput />
                            <FileUpload.Trigger asChild>
                                <IconButton variant={"ghost"} size={"sm"}>
                                    <LuUpload /> Загрузите сертификат
                                </IconButton>
                            </FileUpload.Trigger>
                        </FileUpload.Root>
                    )}
                </Card.Body>
                <Card.Footer>
                    <Button size={"sm"}>Применить</Button>
                </Card.Footer>
            </Card.Root>
        </>
    );
};
