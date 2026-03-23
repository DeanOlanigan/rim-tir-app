import { useCallback, useMemo } from "react";
import { useFilterStore } from "./JournalStores/filter-store";
import { useJournalStream } from "./JournalStores/journal-stream-store";
import { JOURNAL_LIVE_COLUMNS } from "./JournalView/tableColumns";
import { useFilterData } from "./hooks/useFilterData";
import { MenuTypes } from "./JournalFilter/MenuFilters/MenuTypes";
import { MenuCategories } from "./JournalFilter/MenuFilters/MenuCategories";
import { AckButtonRange } from "./JournalView/AckButtonRange";
import { hasRight } from "@/utils/permissions";
import { JournalLiveTableBase } from "./JournalView/JournalLiveTableBase";
import { useAckEventStreamMutation } from "./hooks/useAckEventMutation";

const getFrom = () => {
    const ts = Object.values(useJournalStream.getState().entities)?.[0]?.ts;
    if (ts) {
        return ts;
    } else {
        return getTo();
    }
};

const getTo = () => {
    return Date.now();
};

export const JournalLiveTable = () => {
    const ids = useJournalStream((s) => s.ids);
    const entities = useJournalStream((s) => s.entities);
    const selectedMessages = useFilterStore((s) => s.selectedMessages);
    const selectedCategory = useFilterStore((s) => s.selectedCategory);

    const ackRangeMutation = useAckEventStreamMutation();

    const rowData = useMemo(
        () => ids.map((id) => entities[id]),
        [ids, entities],
    );

    const data = useFilterData(rowData, selectedMessages, selectedCategory);

    const renderLiveHeaderContent = useCallback(
        ({ column, user }) => {
            if (column.value === "type")
                return <MenuTypes name={column.label} />;
            if (column.value === "category")
                return <MenuCategories name={column.label} />;
            if (column.value === "needAck" && hasRight(user, "journal.ack")) {
                return (
                    <AckButtonRange
                        tooltip={"Квитировать все события текущей сессии"}
                        confirmMessage={
                            "Будут квитированы все события текущей сессии"
                        }
                        onAccept={() => {
                            const fromTs = getFrom();
                            const toTs = getTo();
                            ackRangeMutation.mutate({ fromTs, toTs });
                        }}
                    />
                );
            }
            return column.label;
        },
        [ackRangeMutation],
    );

    return (
        <JournalLiveTableBase
            columns={JOURNAL_LIVE_COLUMNS}
            data={data}
            renderHeaderContent={renderLiveHeaderContent}
        />
    );
};
