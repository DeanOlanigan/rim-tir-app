import { useMemo } from "react";
import { useFilterStore } from "./JournalStores/filter-store";
import { useJournalStream } from "./JournalStores/journal-stream-store";
import { JournalTableBase } from "./JournalView/JournalTableBase";
import { JOURNAL_LIVE_COLUMNS } from "./JournalView/tableColumns";
import { useFilterDataM } from "./hooks/useFilterData";
import { MenuTypes } from "./JournalFilter/MenuFilters/MenuTypes";

const renderLiveHeaderContent = (column) => {
    if (column.value === "type") return <MenuTypes name={column.label} />;
    return column.label;
};

export const JournalLiveTable = () => {
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
            columns={JOURNAL_LIVE_COLUMNS}
            data={data}
            renderHeaderContent={renderLiveHeaderContent}
        />
    );
};
