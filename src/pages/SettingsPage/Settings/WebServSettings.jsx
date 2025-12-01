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
    const settings = useSettingStore((s) => s.settings);
    const EditSettings = useSettingStore((s) => s.EditSettings);
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
                                    Number(settings?.WebServer?.port) < 1024 ||
                                    Number(settings?.WebServer?.port) > 49151 ||
                                    (settings?.WebServer?.port || "").trim() ===
                                        ""
                                }
                            >
                                <Field.Label>Порт</Field.Label>
                                <NumberInput.Root
                                    value={settings?.WebServer?.port || ""}
                                    pattern={"[0-9]*"}
                                    allowMouseWheel="true"
                                    min={"1024"}
                                    max={"49151"}
                                    allowOverflow={false}
                                    w="100%"
                                    inputMode={"numeric"}
                                    size={"sm"}
                                    onValueChange={(e) => {
                                        EditSettings(
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
                                    1024 или больше 49151
                                </Field.ErrorText>
                            </Field.Root>
                            <Field.Root>
                                <Field.Label>Время сессии</Field.Label>
                                <Input
                                    size={"sm"}
                                    type="time"
                                    value={settings?.WebServer?.time || ""}
                                    onChange={(e) => {
                                        EditSettings(
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
                        checked={settings?.WebServer?.https || false}
                        onCheckedChange={(e) => {
                            EditSettings(e.checked, "https", "WebServer");
                        }}
                    >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label>HTTPS</Switch.Label>
                    </Switch.Root>
                    {settings?.WebServer?.https && (
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
