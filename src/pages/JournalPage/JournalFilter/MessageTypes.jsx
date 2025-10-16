import { Stack, CheckboxGroup, Checkbox } from "@chakra-ui/react";

const messageTypes = [
    { label: "ТС", value: "eventTypeTSCheck" },
    { label: "Пользовательские ТУ", value: "eventTypeTUCheck" },
];

export const MessageTypes = () => {
    return (
        <Stack p={"1"}>
            <CheckboxGroup
                onValueChange={(types) => console.log("Message types: ", types)}
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
