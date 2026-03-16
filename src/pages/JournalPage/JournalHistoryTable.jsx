import { useMemo } from "react";
import { useFilterStore } from "./JournalStores/filter-store";
import { JournalTableBase } from "./JournalView/JournalTableBase";
import { JOURNAL_HISTORY_COLUMNS } from "./JournalView/tableColumns";
import { useFilterDataM } from "./hooks/useFilterData";
import { Tooltip } from "@/components/ui/tooltip";
import { Button, Center, IconButton, Spinner, VStack } from "@chakra-ui/react";
import { LuCheckCheck } from "react-icons/lu";
import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";
import { useJournalHistoryStore } from "./JournalStores/journal-history-store";
import { useJournalHistoryQuery } from "./hooks/useJournalHistoryQuery";
import { eventAcknowledgeRange } from "@/api/commands";

const renderHistoryHeaderContent = (column) => {
    if (column.value === "needAck")
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
                            onAccept: () => {
                                const fromTs = new Date(
                                    useJournalHistoryStore.getState().from,
                                ).getTime();
                                const toTs = new Date(
                                    useJournalHistoryStore.getState().to,
                                ).getTime();
                                eventAcknowledgeRange({
                                    fromTs,
                                    toTs,
                                });
                            },
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
    return column.label;
};

export const JournalHistoryTable = () => {
    const selectedMessages = useFilterStore((s) => s.selectedMessages);
    const selectedCategory = useFilterStore((s) => s.selectedCategory);

    const from = useJournalHistoryStore((s) => s.from);
    const to = useJournalHistoryStore((s) => s.to);
    const limit = useJournalHistoryStore((s) => s.limit);

    const {
        data,
        isLoading,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useJournalHistoryQuery({
        from,
        to,
        limit,
    });

    const rowData = useMemo(
        () => data?.pages.flatMap((page) => page.items ?? []) ?? [],
        [data],
    );

    const filteredData = useFilterDataM(
        rowData,
        selectedMessages,
        selectedCategory,
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
                data={filteredData}
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
