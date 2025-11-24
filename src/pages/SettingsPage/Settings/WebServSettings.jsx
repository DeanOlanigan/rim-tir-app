import {
    Heading,
    NumberInput,
    Field,
    Input,
    Fieldset,
    Card,
    Switch,
    FileUpload,
    IconButton,
    Text,
} from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import { useSettingStore } from "./SettingsStore/settings-store";

export const ServerSettings = () => {
    const { WebServer, setSettings } = useSettingStore();
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
                            <Field.Root
                                invalid={
                                    Number(WebServer.port) < 50 ||
                                    Number(WebServer.port) > 9999 ||
                                    WebServer.port.trim() === ""
                                }
                            >
                                <Field.Label>Порт</Field.Label>
                                <NumberInput.Root
                                    value={WebServer.port}
                                    pattern={"[0-9]*"}
                                    allowMouseWheel="true"
                                    min={"50"}
                                    max={"9999"}
                                    w="100%"
                                    inputMode={"numeric"}
                                    size={"sm"}
                                    onValueChange={(e) =>
                                        setSettings(
                                            "WebServer",
                                            "port",
                                            e.value
                                        )
                                    }
                                >
                                    <NumberInput.Control />
                                    <NumberInput.Input />
                                </NumberInput.Root>
                                <Field.ErrorText>
                                    *Порт не может быть отрицательным, меньше 50
                                    или больше 9999
                                </Field.ErrorText>
                            </Field.Root>
                            <Field.Root>
                                <Field.Label>Время сессии</Field.Label>
                                <Input
                                    size={"sm"}
                                    type="time"
                                    value={WebServer.time}
                                    onChange={(e) =>
                                        setSettings(
                                            "WebServer",
                                            "time",
                                            e.target.value
                                        )
                                    }
                                />
                            </Field.Root>
                        </Fieldset.Content>
                    </Fieldset.Root>
                    <Switch.Root
                        paddingTop="3"
                        value={WebServer.https}
                        onCheckedChange={(e) =>
                            setSettings("WebServer", "https", e.checked)
                        }
                    >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label>HTTPS</Switch.Label>
                    </Switch.Root>
                    {WebServer.https && (
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
            </Card.Root>
        </>
    );
};
