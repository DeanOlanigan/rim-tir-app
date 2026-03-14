import { useMemo } from "react";
import { useFilterStore } from "./JournalStores/filter-store";
import { useJournalStream } from "./JournalStores/journal-stream-store";
import { JournalTableBase } from "./JournalView/JournalTableBase";
import { JOURNAL_HISTORY_COLUMNS } from "./JournalView/tableColumns";
import { useFilterDataM } from "./hooks/useFilterData";
import { MenuTypes } from "./JournalFilter/MenuFilters/MenuTypes";
import { Tooltip } from "@/components/ui/tooltip";
import { IconButton } from "@chakra-ui/react";
import { LuCheckCheck } from "react-icons/lu";
import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";

const renderHistoryHeaderContent = (column) => {
    switch (column.value) {
        case "type":
            return <MenuTypes name={column.label} />;

        case "needAck":
            return (
                <Tooltip
                    showArrow
                    content={"Квитировать все события за выбранный период"}
                >
                    <IconButton
                        variant="ghost"
                        size="2xs"
                        color={"fg"}
                        onClick={() =>
                            confirmDialog.open(CONFIRM_DIALOG_ID, {
                                onAccept: () => console.log("ACK ALL HISTORY"),
                                title: "Квитировать все события?",
                                message:
                                    "Будут квитированы все события за выбранный период.",
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

export const JournalHistoryTable = () => {
    const ids = useJournalStream((s) => s.ids);
    const entities = useJournalStream((s) => s.entities);
    const selectedMessages = useFilterStore((s) => s.selectedMessages);

    const rowData = useMemo(
        () => ids.map((id) => entities[id]),
        [ids, entities],
    );

    const data = useFilterDataM(rowData, selectedMessages);

    return (
        <JournalTableBase
            columns={JOURNAL_HISTORY_COLUMNS}
            data={data}
            renderHeaderContent={renderHistoryHeaderContent}
        />
    );
};
