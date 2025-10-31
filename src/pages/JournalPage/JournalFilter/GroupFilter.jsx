import { Stack, CheckboxGroup, Checkbox } from "@chakra-ui/react";
import { useGroupStore } from "../JournalStores/GroupFilterStore";

const groups = [
    { label: "Без группы", value: "Без Группы" },
    { label: "Аварийные", value: "Аварийная" },
    { label: "Предупредительные", value: "Предупредительная" },
    { label: "Оперативного состояния", value: "Состояние" },
];

export const GroupFilter = () => {
    const { selectedGroups, setSelectedGroups } = useGroupStore();

    return (
        <Stack p={"1"}>
            <CheckboxGroup
                value={selectedGroups}
                onValueChange={(value) => setSelectedGroups(value)}
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
