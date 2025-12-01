import {
    Card,
    Field,
    Fieldset,
    Heading,
    NumberInput,
    Switch,
    Text,
} from "@chakra-ui/react";
import { useSettingStore } from "./SettingsStore/settings-store";

export const LogSettings = () => {
    const settings = useSettingStore((s) => s.settings);
    const EditSettings = useSettingStore((s) => s.EditSettings);
    return (
        <>
            <Heading paddingBottom={"2"}>Лог файлы</Heading>
            <Card.Root variant={"elevated"}>
                <Card.Body>
                    <Fieldset.Root>
                        <Fieldset.Legend>
                            <Text fontSize={"lg"}>Параметры Лог-Файлов</Text>
                        </Fieldset.Legend>
                        <Fieldset.Content>
                            <Field.Root
                                invalid={
                                    parseFloat(settings?.Logs?.size) < 0.5 ||
                                    parseFloat(settings?.Logs?.size) > 5 ||
                                    (settings?.Logs?.size || "").trim() ===
                                        "MB" ||
                                    (settings?.Logs?.size || "").trim() === ""
                                }
                            >
                                <Field.Label>Размер</Field.Label>
                                <NumberInput.Root
                                    w="100%"
                                    size={"sm"}
                                    value={settings?.Logs?.size || ""}
                                    onValueChange={(e) => {
                                        EditSettings(e.value, "size", "Logs");
                                    }}
                                    min={"0.5"}
                                    max={"5"}
                                    step={"0.5"}
                                    allowMouseWheel="true"
                                    formatOptions={{
                                        style: "unit",
                                        unit: "megabyte",
                                        unitDiplay: "long",
                                    }}
                                >
                                    <NumberInput.Control />
                                    <NumberInput.Input />
                                </NumberInput.Root>
                                <Field.ErrorText>
                                    *Размер не должен быть меньше 0.5 или больше
                                    5 MB
                                </Field.ErrorText>
                            </Field.Root>
                            <Field.Root
                                invalid={
                                    Number(settings?.Logs?.files) < 1 ||
                                    Number(settings?.Logs?.files) > 10 ||
                                    (settings?.Logs?.size || "").trim === ""
                                }
                            >
                                <Field.Label>Количество файлов</Field.Label>
                                <NumberInput.Root
                                    w="100%"
                                    min="1"
                                    max="10"
                                    value={settings?.Logs?.files || ""}
                                    size="sm"
                                    onValueChange={(e) => {
                                        EditSettings(e.value, "files", "Logs");
                                    }}
                                >
                                    <NumberInput.Control />
                                    <NumberInput.Input />
                                </NumberInput.Root>
                                <Field.ErrorText>
                                    *Количество файлов не может быть меньше 0
                                    или больше 10
                                </Field.ErrorText>
                            </Field.Root>
                            <Switch.Root
                                paddingTop="3"
                                checked={settings?.Logs?.archive || false}
                                onCheckedChange={(e) => {
                                    EditSettings(e.checked, "archive", "Logs");
                                }}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control />
                                <Switch.Label>Сжатие</Switch.Label>
                            </Switch.Root>
                        </Fieldset.Content>
                    </Fieldset.Root>
                </Card.Body>
            </Card.Root>
        </>
    );
};
