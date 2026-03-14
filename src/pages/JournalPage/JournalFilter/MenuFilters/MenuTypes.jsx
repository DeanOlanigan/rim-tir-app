import { memo } from "react";
import { useFilterStore } from "../../JournalStores/filter-store";
import { FilterCheckboxMenu } from "./FilterCheckboxMenu";

const TYPE_FILTER_ITEMS = [
    { label: "Критическая", value: "critical" },
    { label: "Тревога", value: "error" },
    { label: "Предупреждение", value: "warning" },
    { label: "Информация", value: "info" },
];

export const MenuTypes = memo(function MenuTypes({ name }) {
    const selectedMessages = useFilterStore((state) => state.selectedMessages);
    const toggleMessage = useFilterStore((state) => state.toggleMessage);

    return (
        <FilterCheckboxMenu
            name={name}
            items={TYPE_FILTER_ITEMS}
            selected={selectedMessages}
            onToggle={toggleMessage}
        />
    );
});
