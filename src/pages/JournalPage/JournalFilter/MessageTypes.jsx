import { Stack, CheckboxGroup, Checkbox } from "@chakra-ui/react";
import { useFilterStore } from "../JournalStores/FilterStore";

const messageTypes = [
    { label: "ТС", value: "ТС" },
    { label: "Пользовательские ТУ", value: "ТУ" },
];

export const MessageTypes = () => {
    const { selectedMessages, setSelectedMessages } = useFilterStore();

    return (
        <Stack p={"1"}>
            <CheckboxGroup
                value={selectedMessages}
                onValueChange={(types) => setSelectedMessages(types)}
            >
                {messageTypes.map((type) => (
                    <Checkbox.Root key={type.value} value={type.value}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>{type.label}</Checkbox.Label>
                    </Checkbox.Root>
                ))}
            </CheckboxGroup>
        </Stack>
    );
};
