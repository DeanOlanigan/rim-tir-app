import { Box, IconButton, ScrollArea, Text } from "@chakra-ui/react";
import { useLogStore } from "../Store/store";
import { useStickToBottom } from "use-stick-to-bottom";
import { LuArrowDown } from "react-icons/lu";
import { NoData } from "@/components/NoData";
import { useLogStream } from "../Store/stream-store";
import { useMqttLogs } from "./useMqttLogs";
import { useQuery } from "@tanstack/react-query";
import { getLog } from "@/api/log";
import { useEffect, useMemo } from "react";
import { Loader } from "@/components/Loader";
import { ErrorInformer } from "@/components/ErrorInformer";
import { LOG_LEVELS } from "@/config/constants";

const LEVEL_COLOR = {
    [LOG_LEVELS.info]: "blue.500",
    [LOG_LEVELS.error]: "red.500",
    [LOG_LEVELS.warn]: "yellow.500",
    [LOG_LEVELS.status]: "green.500",
    [LOG_LEVELS.debug]: "gray.500",
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
        queryFn: async () => {
            const res = await getLog(
                chosenLog.label,
                chosenLog.category,
                logRowsCount,
                "json"
            );
            return res?.data ?? [];
        },
    });

    const filename = chosenLog.label;
    const type = chosenLog.category;
    const topic = `log/${type}/${filename}`;
    useEffect(() => {
        useLogStream.getState().reset();
    }, [filename, type]);

    useMqttLogs(topic);
    const live = useLogStream((state) => state.live);

    const rows = useMemo(() => {
        const base = [...(data ?? []), ...live];
        if (!filter?.length) return base;
        const allow = new Set(filter);
        return base.filter((r) => allow.has(r.level));
    }, [data, filter, live]);

    if (isLoading) return <Loader text={"Загрузка данных"} />;
    if (isError) return <ErrorInformer error={error} />;

    // TODO Идея фильтровать колонки (убирать дату, тип лога и т.д.)

    return (
        <ScrollArea.Root variant={"hover"}>
            <ScrollArea.Viewport ref={sticky.scrollRef} css={shadowCss}>
                <ScrollArea.Content ref={sticky.contentRef}>
                    {rows.length === 0 ? (
                        <NoData />
                    ) : (
                        rows.map((row) => (
                            <LogRow
                                key={row.epochMs}
                                row={row}
                                logTextSize={logTextSize}
                                isLogTextWrapped={isLogTextWrapped}
                            />
                        ))
                    )}
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
