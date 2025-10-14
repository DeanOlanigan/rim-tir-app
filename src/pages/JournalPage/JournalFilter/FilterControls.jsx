import { Button } from "@chakra-ui/react";
import { useGroupStore } from "../JournalStores/GroupFilterStore";
import { useMessageFilterStore } from "../JournalStores/MessageFilterStore";
import { useJournalFiltersArchiveStore } from "../JournalStores/JournalFiltersArсhiveStore";

export const FilterControls = () => {

    const resetSelectedGroups = useGroupStore((state) => (state.setSelectedGroups))
    const resetSelMessages = useMessageFilterStore(state => state.setSelectedMessages)
    const resetArchive = useJournalFiltersArchiveStore(state => state.setInitial)

    const handleApply = () => {
        console.log("handleApply");
    };

    const handleReset = () => {
        console.log("handleReset");
        resetSelectedGroups(["state", "danger", "warn", "noGroup"]);
        resetSelMessages(["eventTypeTSCheck", "eventTypeTUCheck"]);
        resetArchive();
    };

    return (
        <>
            <Button size={"xs"} onClick={handleApply}>
                Применить
            </Button>
            <Button size={"xs"} onClick={handleReset}>
                Сбросить
            </Button>
        </>
    );
};