import { useCallback, useEffect, useMemo, useRef } from "react";
import { JOURNAL_HISTORY_COLUMNS } from "./JournalView/tableColumns";
import { Center, Spinner, VStack } from "@chakra-ui/react";
import { useJournalHistoryStore } from "./JournalStores/journal-history-store";
import { useJournalHistoryQuery } from "./hooks/useJournalHistoryQuery";
import { AckButtonRange } from "./JournalView/AckButtonRange";
import { getLocalTimeZone } from "@internationalized/date";
import { RADII_MAIN } from "@/config/constants";
import { formatJournalDate } from "./formatJournalDate";
import { hasRight } from "@/utils/permissions";
import { JournalHistoryTableBase } from "./JournalView/JournalHistoryTableBase";

function toISO(data) {
    return data.toDate(getLocalTimeZone()).toISOString();
}

function getPeriod() {
    return {
        from: toISO(useJournalHistoryStore.getState().filters.period.from),
        to: toISO(useJournalHistoryStore.getState().filters.period.to),
    };
}

const renderHistoryHeaderContent = ({ column, user }) => {
    if (column.value === "needAck" && hasRight(user, "journal.ack"))
        return (
            <AckButtonRange
                tooltip={"Квитировать все события за выбранный период"}
                confirmMessage={
                    "Будут квитированы все события за выбранный период"
                }
                getPeriod={getPeriod}
            />
        );
    return column.label;
};

const BOTTOM_OFFSET_PX = 500;

export const JournalHistoryTable = () => {
    const filters = useJournalHistoryStore((s) => s.filters);
    const tableContainerRef = useRef(null);

    const {
        data,
        isLoading,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetching,
        isFetchingNextPage,
    } = useJournalHistoryQuery(filters);

    const rowData = useMemo(
        () =>
            data?.pages.flatMap((page) =>
                (page.items ?? []).map((item) => ({
                    ...item,
                    tsText: formatJournalDate(item.ts),
                })),
            ) ?? [],
        [data],
    );

    const fetchMoreOnBottomReached = useCallback(
        (container) => {
            if (!container) return;
            if (!hasNextPage || isFetchingNextPage) return;

            const { scrollHeight, scrollTop, clientHeight } = container;
            const distanceToBottom = scrollHeight - scrollTop - clientHeight;

            if (distanceToBottom < BOTTOM_OFFSET_PX && !isFetching) {
                fetchNextPage();
            }
        },
        [fetchNextPage, isFetching, hasNextPage, isFetchingNextPage],
    );

    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current);
    }, [fetchMoreOnBottomReached, rowData.length]);

    if (isLoading) {
        return (
            <Center h="100%">
                <Spinner size="sm" />
            </Center>
        );
    }

    if (isError) {
        return (
            <Center h="100%">
                Ошибка загрузки журнала: {error?.message ?? "unknown error"}
            </Center>
        );
    }

    return (
        <VStack
            align={"stretch"}
            flex={1}
            h={"100%"}
            minH={0}
            w={"full"}
            px={6}
            py={4}
            bg={"bg.panel"}
            borderRadius={RADII_MAIN}
            shadow={"md"}
        >
            <JournalHistoryTableBase
                columns={JOURNAL_HISTORY_COLUMNS}
                data={rowData}
                renderHeaderContent={renderHistoryHeaderContent}
                containerRef={tableContainerRef}
                onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
            />

            {isFetchingNextPage && (
                <Center py={2}>
                    <Spinner size="sm" />
                </Center>
            )}
        </VStack>
    );
};
