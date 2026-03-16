import { useMemo } from "react";
import { useFilterStore } from "./JournalStores/filter-store";
import { useJournalStream } from "./JournalStores/journal-stream-store";
import { JournalTableBase } from "./JournalView/JournalTableBase";
import { JOURNAL_LIVE_COLUMNS } from "./JournalView/tableColumns";
import { useFilterDataM } from "./hooks/useFilterData";
import { MenuTypes } from "./JournalFilter/MenuFilters/MenuTypes";
import { MenuCategories } from "./JournalFilter/MenuFilters/MenuCategories";
import { Tooltip } from "@/components/ui/tooltip";
import { IconButton } from "@chakra-ui/react";
import { LuCheckCheck } from "react-icons/lu";
import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";
import { eventAcknowledgeRange } from "@/api/commands";

const renderLiveHeaderContent = (column) => {
    switch (column.value) {
        case "type":
            return <MenuTypes name={column.label} />;
        case "category":
            return <MenuCategories name={column.label} />;
        case "needAck":
            return (
                <Tooltip
                    showArrow
                    content={"Квитировать все события текущей сессии"}
                >
                    <IconButton
                        variant="ghost"
                        size="2xs"
                        color={"fg"}
                        onClick={() =>
                            confirmDialog.open(CONFIRM_DIALOG_ID, {
                                onAccept: () => {
                                    console.log("ACK ALL SESSION");
                                    const entities =
                                        useJournalStream.getState().entities;
                                    eventAcknowledgeRange({
                                        fromTs: Object.values(entities)[0].ts,
                                        toTs: Date.now(),
                                    });
                                },
                                title: "Квитировать все события?",
                                message:
                                    "Будут квитированы все события текущей сессии.",
                            })
                        }
                    >
                        <LuCheckCheck />
                    </IconButton>
                </Tooltip>
            );

        default:
            return column.label;
    }
};

export const JournalLiveTable = () => {
    const ids = useJournalStream((s) => s.ids);
    const entities = useJournalStream((s) => s.entities);
    const selectedMessages = useFilterStore((s) => s.selectedMessages);
    const selectedCategory = useFilterStore((s) => s.selectedCategory);

    const rowData = useMemo(
        () => ids.map((id) => entities[id]),
        [ids, entities],
    );

    const data = useFilterDataM(rowData, selectedMessages, selectedCategory);

    return (
        <JournalTableBase
            columns={JOURNAL_LIVE_COLUMNS}
            data={data}
            renderHeaderContent={renderLiveHeaderContent}
        />
    );
};
