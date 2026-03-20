import { useMemo } from "react";
import { useFilterStore } from "./JournalStores/filter-store";
import { useJournalStream } from "./JournalStores/journal-stream-store";
import { JOURNAL_LIVE_COLUMNS } from "./JournalView/tableColumns";
import { useFilterData } from "./hooks/useFilterData";
import { MenuTypes } from "./JournalFilter/MenuFilters/MenuTypes";
import { MenuCategories } from "./JournalFilter/MenuFilters/MenuCategories";
import { AckButtonRange } from "./JournalView/AckButtonRange";
import { hasRight } from "@/utils/permissions";
import { JournalLiveTableBase } from "./JournalView/JournalLiveTableBase";

const getFrom = () => {
    const ts = Object.values(useJournalStream.getState().entities)?.[0]?.ts;
    if (ts) {
        return new Date(ts).toISOString();
    } else {
        return getTo();
    }
};

const getTo = () => {
    return new Date(Date.now()).toISOString();
};

function getPeriod() {
    return {
        from: getFrom(),
        to: getTo(),
    };
}

const renderLiveHeaderContent = ({ column, user }) => {
    if (column.value === "type") return <MenuTypes name={column.label} />;
    if (column.value === "category")
        return <MenuCategories name={column.label} />;
    if (column.value === "needAck" && hasRight(user, "journal.ack")) {
        return (
            <AckButtonRange
                tooltip={"Квитировать все события текущей сессии"}
                confirmMessage={"Будут квитированы все события текущей сессии"}
                getPeriod={getPeriod}
            />
        );
    }
    return column.label;
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

    const data = useFilterData(rowData, selectedMessages, selectedCategory);

    return (
        <JournalLiveTableBase
            columns={JOURNAL_LIVE_COLUMNS}
            data={data}
            renderHeaderContent={renderLiveHeaderContent}
        />
    );
};
