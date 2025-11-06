import { Button } from "@chakra-ui/react";
import { useFilterStore } from "../JournalStores/FilterStore";

export const FilterControls = () => {
    const { setSelectedGroups, setSelectedMessages, setArchiveInitial } =
        useFilterStore();

    const handleApply = () => {
        console.log("handleApply");
    };

    const handleReset = () => {
        console.log("handleReset");
        setSelectedGroups([
            "Состояние",
            "Аварийная",
            "Предупредительная",
            "Без Группы",
            "Пауза",
            "Возобновлен",
        ]);
        setSelectedMessages(["ТС", "ТУ", "Пауза", "Старт"]);
        setArchiveInitial();
    };

    return (
        <>
            <Button size={"xs"} onClick={handleReset}>
                Сбросить
            </Button>
            <Button size={"xs"} onClick={handleApply}>
                Применить
            </Button>
        </>
    );
};
