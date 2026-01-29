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
import { useSettingStore } from "./SettingsStore/settings-store";

export const JournalSettings = () => {
    const journals = useSettingStore((s) => s.settings?.Journals);
    const editSettings = useSettingStore.getState().editSettingsJourn;
    return (
        <>
            <Heading paddingBottom={"2"}>Журналы</Heading>
            <Stack direction={"row"}>
                {journals?.map((journal) => (
                    <Card.Root
                        variant={"elevated"}
                        w={"50%"}
                        key={journal.name}
                    >
                        <Card.Body>
                            <Fieldset.Root>
                                <Fieldset.Legend>
                                    {journal.name === "event" ? (
                                        <Text fontSize={"lg"}>
                                            Журнал Событий
                                        </Text>
                                    ) : (
                                        <Text fontSize={"lg"}>Журнал ТИ</Text>
                                    )}
                                </Fieldset.Legend>
                                <Fieldset.Content>
                                    <Field.Root
                                        invalid={
                                            parseFloat(journal.size) < 0.5 ||
                                            parseFloat(journal.size) > 5 ||
                                            journal.size.trim() === "" ||
                                            journal.size.trim() === "MB"
                                        }
                                    >
                                        <Field.Label>
                                            Размер журнала
                                        </Field.Label>
                                        <NumberInput.Root
                                            value={journal.size}
                                            onValueChange={(e) => {
                                                editSettings(
                                                    e.value,
                                                    "size",
                                                    journal.name,
                                                );
                                            }}
                                            w="100%"
                                            min="0.5"
                                            max="5"
                                            step="0.5"
                                            size={"sm"}
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
                                            *Размер не должен быть меньше 0.5
                                            или больше 5 MB
                                        </Field.ErrorText>
                                    </Field.Root>
                                    <Field.Root
                                        invalid={
                                            Number(journal.files) < 1 ||
                                            Number(journal.files) > 10 ||
                                            journal.files.trim() === ""
                                        }
                                    >
                                        <Field.Label>
                                            Количество файлов
                                        </Field.Label>
                                        <NumberInput.Root
                                            value={journal.files}
                                            onValueChange={(e) => {
                                                editSettings(
                                                    e.value,
                                                    "files",
                                                    journal.name,
                                                );
                                            }}
                                            w="100%"
                                            min="1"
                                            max="10"
                                            size="sm"
                                            allowMouseWheel="true"
                                        >
                                            <NumberInput.Control />
                                            <NumberInput.Input />
                                        </NumberInput.Root>
                                        <Field.ErrorText>
                                            *Количество файлов не может быть
                                            меньше 0 или больше 10
                                        </Field.ErrorText>
                                    </Field.Root>
                                    <Switch.Root
                                        paddingTop="3"
                                        checked={journal.archive}
                                        onCheckedChange={(e) => {
                                            editSettings(
                                                e.checked,
                                                "archive",
                                                journal.name,
                                            );
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
                ))}
            </Stack>
        </>
    );
};
