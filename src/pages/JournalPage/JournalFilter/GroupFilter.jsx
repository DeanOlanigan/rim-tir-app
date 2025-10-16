import { Stack, CheckboxGroup, Checkbox } from "@chakra-ui/react";

const groups = [
    { label: "Без группы", value: "groupEmptyCheck" },
    { label: "Аварийные", value: "groupDangerCheck" },
    { label: "Предупредительные", value: "groupWarnCheck" },
    { label: "Оперативного состояния", value: "groupStateCheck" },
];

export const GroupFilter = () => {
    return (
        <Stack p={"1"}>
            <CheckboxGroup
                onValueChange={(value) => console.log("onValueChange", value)}
            >
                {groups.map((group) => (
                    <Checkbox.Root key={group.value} value={group.value}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>{group.label}</Checkbox.Label>
                    </Checkbox.Root>
                ))}
            </CheckboxGroup>
        </Stack>
    );
};
