import { useMemo } from "react";
import { JournalTableBase } from "./JournalView/JournalTableBase";
import { JOURNAL_HISTORY_COLUMNS } from "./JournalView/tableColumns";
import { Button, Center, Spinner, VStack } from "@chakra-ui/react";
import { useJournalHistoryStore } from "./JournalStores/journal-history-store";
import { useJournalHistoryQuery } from "./hooks/useJournalHistoryQuery";
import { AckButtonRange } from "./JournalView/AckButtonRange";
import { getLocalTimeZone } from "@internationalized/date";

function toISO(data) {
    return data.toDate(getLocalTimeZone()).toISOString();
}

function getPeriod() {
    return {
        from: toISO(useJournalHistoryStore.getState().filters.period.from),
        to: toISO(useJournalHistoryStore.getState().filters.period.to),
    };
}

const renderHistoryHeaderContent = (column) => {
    if (column.value === "needAck")
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

export const JournalHistoryTable = () => {
    const filters = useJournalHistoryStore((s) => s.filters);

    const {
        data,
        isLoading,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useJournalHistoryQuery(filters);

    const rowData = useMemo(
        () => data?.pages.flatMap((page) => page.items ?? []) ?? [],
        [data],
    );

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
        <VStack align={"stretch"} flex={1} h={"100%"} minH={0}>
            <JournalTableBase
                columns={JOURNAL_HISTORY_COLUMNS}
                data={rowData}
                renderHeaderContent={renderHistoryHeaderContent}
            />

            {hasNextPage && (
                <Button
                    size={"xs"}
                    variant={"outline"}
                    onClick={() => fetchNextPage()}
                    isLoading={isFetchingNextPage}
                >
                    Загрузить ещё
                </Button>
            )}
        </VStack>
    );
};
