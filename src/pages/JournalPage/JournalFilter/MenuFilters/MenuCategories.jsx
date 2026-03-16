import { memo } from "react";
import { useFilterStore } from "../../JournalStores/filter-store";
import { FilterCheckboxMenu } from "./FilterCheckboxMenu";

const CATEGORY_FILTER_ITEMS = [
    { label: "Переменная", value: "variable" },
    { label: "Пользователь", value: "user" },
    { label: "Событие", value: "event" },
    { label: "Конфигурация", value: "config" },
    { label: "HMI", value: "hmi" },
    { label: "Сервер", value: "server" },
    { label: "Настройки", value: "settings" },
    { label: "Безопасность", value: "security" },
    { label: "Система", value: "system" },
];

export const MenuCategories = memo(function MenuTypes({ name }) {
    const selectedCategory = useFilterStore((state) => state.selectedCategory);
    const toggleCategory = useFilterStore((state) => state.toggleCategory);

    return (
        <FilterCheckboxMenu
            name={name}
            items={CATEGORY_FILTER_ITEMS}
            selected={selectedCategory}
            onToggle={toggleCategory}
        />
    );
});
