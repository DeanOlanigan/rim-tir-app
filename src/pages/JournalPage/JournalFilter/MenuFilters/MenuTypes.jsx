import { memo } from "react";
import { useFilterStore } from "../../JournalStores/filter-store";
import { FilterCheckboxMenu } from "./FilterCheckboxMenu";

const TYPE_FILTER_ITEMS = [
    //{ label: "ТС", value: "ts" },
    //{ label: "Пользовательские ТУ", value: "tu" },
    //{ label: "Пауза", value: "pause" },
    //{ label: "Возобновление", value: "resume" },
    { label: "Тревога", value: "error" },
    { label: "Информация", value: "info" },
    { label: "Предупреждение", value: "warn" },
    { label: "Пауза", value: "pause" },
    { label: "Возобновление", value: "resume" },
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
