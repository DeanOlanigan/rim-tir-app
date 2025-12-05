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
    const port = useSettingStore((s) => s.settings?.WebServer?.port);
    const time = useSettingStore((s) => s.settings?.WebServer?.time);
    const https = useSettingStore((s) => s.settings?.WebServer?.https);
    const editSettings = useSettingStore.getState().editSettings;

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
                                    Number(port) < 1024 ||
                                    Number(port) > 65535 ||
                                    (port || "").trim() === ""
                                }
                            >
                                <Field.Label>Порт</Field.Label>
                                <NumberInput.Root
                                    value={port || ""}
                                    pattern={"[0-9]*"}
                                    allowMouseWheel="true"
                                    min={"1024"}
                                    max={"49151"}
                                    allowOverflow={false}
                                    w="100%"
                                    inputMode={"numeric"}
                                    size={"sm"}
                                    onValueChange={(e) => {
                                        editSettings(
                                            e.value,
                                            "port",
                                            "WebServer"
                                        );
                                    }}
                                >
                                    <NumberInput.Control />
                                    <NumberInput.Input />
                                </NumberInput.Root>
                                <Field.ErrorText>
                                    *Порт не может быть отрицательным, меньше
                                    1024 или больше 65535
                                </Field.ErrorText>
                            </Field.Root>
                            <Field.Root>
                                <Field.Label>Время сессии</Field.Label>
                                <Input
                                    size={"sm"}
                                    type="time"
                                    value={time || ""}
                                    onChange={(e) => {
                                        editSettings(
                                            e.target.value,
                                            "time",
                                            "WebServer"
                                        );
                                    }}
                                />
                            </Field.Root>
                        </Fieldset.Content>
                    </Fieldset.Root>
                    <Switch.Root
                        paddingTop="3"
                        checked={https || false}
                        onCheckedChange={(e) => {
                            editSettings(e.checked, "https", "WebServer");
                        }}
                    >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label>HTTPS</Switch.Label>
                    </Switch.Root>
                    {https && (
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
