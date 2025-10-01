import { Box, IconButton, ScrollArea, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getLog } from "@/api/log";
import { useLogStore } from "../Store/store";
import { useStickToBottom } from "use-stick-to-bottom";
import { LuArrowDown } from "react-icons/lu";
import { useMemo } from "react";

const LEVEL_COLOR = {
    info: "blue.500",
    error: "red.500",
    warning: "yellow.500",
};

const shadowCss = {
    "--scroll-shadow-size": "4rem",
    maskImage:
        "linear-gradient(#000,#000,transparent 0,#000 var(--scroll-shadow-size),#000 calc(100% - var(--scroll-shadow-size)),transparent)",
    "&[data-at-top]": {
        maskImage:
            "linear-gradient(180deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
    },
    "&[data-at-bottom]": {
        maskImage:
            "linear-gradient(0deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
    },
};

export const LogViewerBody = () => {
    const { chosenLog, logRowsCount, logTextSize, isLogTextWrapped, filter } =
        useLogStore();

    const sticky = useStickToBottom();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["logs", chosenLog.label, chosenLog.category, logRowsCount],
        queryFn: () =>
            getLog(chosenLog.label, chosenLog.category, logRowsCount, "json"),
    });

    const rows = useMemo(() => {
        if (!data?.data) return [];
        const list = data.data;
        if (filter.length === 0) return list;

        const allow = new Set(filter);
        return list.filter((r) => allow.has(r.level));
    }, [data, filter]);

    if (isLoading) return "Загрузка...";
    if (isError) return `Ошибка: ${error.message}`;

    // TODO Идея фильтровать колонки (убирать дату, тип лога и т.д.)

    return (
        <ScrollArea.Root variant={"hover"}>
            <ScrollArea.Viewport ref={sticky.scrollRef} css={shadowCss}>
                <ScrollArea.Content ref={sticky.contentRef}>
                    {rows.length === 0
                        ? "Ничего не найдено"
                        : rows.map((row) => (
                              <LogRow
                                  key={row.epochMs}
                                  row={row}
                                  logTextSize={logTextSize}
                                  isLogTextWrapped={isLogTextWrapped}
                              />
                          ))}
                </ScrollArea.Content>
            </ScrollArea.Viewport>
            {!sticky.isAtBottom && (
                <Box position="absolute" bottom="4" right="4" zIndex="10">
                    <IconButton
                        size="sm"
                        onClick={() => {
                            sticky.scrollToBottom();
                        }}
                        colorScheme="blue"
                        variant="solid"
                    >
                        <LuArrowDown />
                    </IconButton>
                </Box>
            )}
            <ScrollArea.Corner />
        </ScrollArea.Root>
    );
};

const LogRow = ({ row, logTextSize, isLogTextWrapped }) => {
    return (
        <Text
            whiteSpace={isLogTextWrapped ? "pre-wrap" : "pre"}
            fontFamily={"monospace"}
            fontSize={logTextSize}
            color={LEVEL_COLOR[row.level]}
        >
            {`[${row.ts}]\t${("[" + row.level.toUpperCase() + "]")
                .toString()
                .padStart(9)}\t${row.message}`}
        </Text>
    );
};
