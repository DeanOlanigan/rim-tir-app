import { memo } from "react";
import { FilterCheckboxMenu } from "./FilterCheckboxMenu";
import { useFilterStore } from "../../JournalStores/filter-store";

const GROUP_FILTER_ITEMS = [
    { label: "Без группы", value: "noGroup" },
    { label: "Аварийные", value: "danger" },
    { label: "Предупредительные", value: "warn" },
    { label: "Оперативного состояния", value: "state" },
    { label: "Пауза", value: "pause" },
    { label: "Возобновлен", value: "resume" },
];

export const MenuGroups = memo(function MenuGroups({ name }) {
    const selectedGroups = useFilterStore((state) => state.selectedGroups);
    const toggleGroup = useFilterStore((state) => state.toggleGroup);

    return (
        <FilterCheckboxMenu
            name={name}
            items={GROUP_FILTER_ITEMS}
            selected={selectedGroups}
            onToggle={toggleGroup}
        />
    );
});
