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
import { useAckRangeHistoryMutation } from "./hooks/useAckRangeMutation";
import { journalFiltersToApiPayload } from "./journal-history-period";
import { useAckEventHistoryMutation } from "./hooks/useAckEventMutation";

function convertToUTC(data) {
    const tz = getLocalTimeZone();
    return data.toDate(tz).toISOString();
}

const BOTTOM_OFFSET_PX = 500;

export const JournalHistoryTable = () => {
    const filters = useJournalHistoryStore((s) => s.filters);
    const apiFilters = journalFiltersToApiPayload(filters);

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
    } = useJournalHistoryQuery(apiFilters);

    const ackRangeMutation = useAckRangeHistoryMutation(apiFilters);
    const ackEventMutation = useAckEventHistoryMutation(apiFilters);

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

    const renderHistoryHeaderContent = useCallback(
        ({ column, user }) => {
            if (column.value === "needAck" && hasRight(user, "journal.ack"))
                return (
                    <AckButtonRange
                        tooltip={"Квитировать все события за выбранный период"}
                        confirmMessage={
                            "Будут квитированы все события за выбранный период"
                        }
                        isPending={ackRangeMutation.isPending}
                        onAccept={() => {
                            const fromUTC = convertToUTC(filters.period.from);
                            const toUTC = convertToUTC(filters.period.to);
                            ackRangeMutation.mutate({ fromUTC, toUTC });
                        }}
                    />
                );
            return column.label;
        },
        [ackRangeMutation, filters],
    );

    const onAckEvent = useCallback(
        (event) => {
            ackEventMutation.mutate({ eventId: event.id });
        },
        [ackEventMutation],
    );

    const isAckEventPending = useCallback(
        (event) =>
            ackEventMutation.isPending &&
            ackEventMutation.variables?.eventId === event.id,
        [ackEventMutation],
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
                onAckEvent={onAckEvent}
                isAckEventPending={isAckEventPending}
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
