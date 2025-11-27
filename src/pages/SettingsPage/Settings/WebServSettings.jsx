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
import { useSettingsEditor } from "./hooks/useSettingsEditor";
import { useCheck } from "./hooks/useCheck";
import { useSettingStore } from "./SettingsStore/settings-store";

export const ServerSettings = ({ settings }) => {
    const EditSettings = useSettingsEditor();
    const isServerChanged = useSettingStore((s) => s.isServerChanged);
    console.log(settings.https, 123);
    const CheckChange = useCheck();
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
                                    Number(settings?.port) < 1024 ||
                                    Number(settings?.port) > 49151 ||
                                    (settings?.port || "").trim() === ""
                                }
                            >
                                <Field.Label>Порт</Field.Label>
                                <NumberInput.Root
                                    value={settings?.port || ""}
                                    pattern={"[0-9]*"}
                                    allowMouseWheel="true"
                                    min={"1024"}
                                    max={"49151"}
                                    allowOverflow={false}
                                    w="100%"
                                    inputMode={"numeric"}
                                    size={"sm"}
                                    onValueChange={(e) => {
                                        CheckChange("isServerChanged");
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
                                    value={settings?.time || ""}
                                    onChange={(e) => {
                                        CheckChange("isServerChanged");
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
                        checked={settings?.https || false}
                        onCheckedChange={(e) => {
                            CheckChange("isServerChanged");
                            EditSettings(e.checked, "https", "WebServer");
                        }}
                    >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label>HTTPS</Switch.Label>
                    </Switch.Root>
                    {settings?.https && (
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
                {isServerChanged && (
                    <Card.Footer>
                        <Text fontWeight={"medium"} color={"red"}>
                            *Не забудьте применить изменения!
                        </Text>
                    </Card.Footer>
                )}
            </Card.Root>
        </>
    );
};
