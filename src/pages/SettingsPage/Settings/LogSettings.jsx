import {
    Card,
    Field,
    Fieldset,
    Heading,
    NumberInput,
    Switch,
    Text,
} from "@chakra-ui/react";
import { useSettingsEditor } from "./hooks/useSettingsEditor";
import { useCheck } from "./hooks/useCheck";
import { useSettingStore } from "./SettingsStore/settings-store";

export const LogSettings = ({ settings }) => {
    const EditSettings = useSettingsEditor();

    const isLogsChanged = useSettingStore((s) => s.isLogsChanged);
    const CheckChange = useCheck();
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
                                    parseFloat(settings?.size) < 0.5 ||
                                    parseFloat(settings?.size) > 5 ||
                                    (settings?.size || "").trim() === "MB" ||
                                    (settings?.size || "").trim() === ""
                                }
                            >
                                <Field.Label>Размер</Field.Label>
                                <NumberInput.Root
                                    w="100%"
                                    size={"sm"}
                                    value={settings?.size || ""}
                                    onValueChange={(e) => {
                                        CheckChange("isLogsChanged");
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
                                    Number(settings?.files) < 1 ||
                                    Number(settings?.files) > 10 ||
                                    (settings?.size || "").trim === ""
                                }
                            >
                                <Field.Label>Количество файлов</Field.Label>
                                <NumberInput.Root
                                    w="100%"
                                    min="1"
                                    max="10"
                                    value={settings?.files || ""}
                                    size="sm"
                                    onValueChange={(e) => {
                                        CheckChange("isLogsChanged");
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
                                checked={settings?.archive || false}
                                onCheckedChange={(e) => {
                                    CheckChange("isLogsChanged");
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
                {isLogsChanged && (
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
