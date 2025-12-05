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
    const size = useSettingStore((s) => s.settings?.Logs?.size);
    const files = useSettingStore((s) => s.settings?.Logs?.files);
    const archive = useSettingStore((s) => s.settings?.Logs?.archive);
    const editSettings = useSettingStore.getState().editSettings;
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
                                    parseFloat(size) < 0.5 ||
                                    parseFloat(size) > 5 ||
                                    (size || "").trim() === "MB" ||
                                    (size || "").trim() === ""
                                }
                            >
                                <Field.Label>Размер</Field.Label>
                                <NumberInput.Root
                                    w="100%"
                                    size={"sm"}
                                    value={size || ""}
                                    onValueChange={(e) => {
                                        editSettings(e.value, "size", "Logs");
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
                                    Number(files) < 1 ||
                                    Number(files) > 10 ||
                                    (size || "").trim === ""
                                }
                            >
                                <Field.Label>Количество файлов</Field.Label>
                                <NumberInput.Root
                                    w="100%"
                                    min="1"
                                    max="10"
                                    value={files || ""}
                                    size="sm"
                                    onValueChange={(e) => {
                                        editSettings(e.value, "files", "Logs");
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
                                checked={archive || false}
                                onCheckedChange={(e) => {
                                    editSettings(e.checked, "archive", "Logs");
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
