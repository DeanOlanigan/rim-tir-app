import { Box, IconButton, Text } from "@chakra-ui/react";
import { NoData } from "@/components/NoData";
import { Loader } from "@/components/Loader";
import { ErrorInformer } from "@/components/ErrorInformer";
import { LOG_LEVELS } from "@/config/constants";
import { useLogData } from "./useLogData";
import { useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useStickToBottom } from "use-stick-to-bottom";
import { LuArrowDown } from "react-icons/lu";

const LEVEL_COLOR = {
    [LOG_LEVELS.info]: "blue.500",
    [LOG_LEVELS.error]: "red.500",
    [LOG_LEVELS.warn]: "yellow.500",
    [LOG_LEVELS.status]: "green.500",
    [LOG_LEVELS.debug]: "gray.500",
};

export const LogViewerBody = () => {
    const {
        q: { isLoading, isError, error },
        live,
        logTextSize,
        isLogTextWrapped,
    } = useLogData();
    const sticky = useStickToBottom();

    const rowVirtualizer = useVirtualizer({
        count: live.length,
        getScrollElement: () => sticky.scrollRef.current,
        estimateSize: () => logTextSize * 1.5,
        measureElement: (el) => {
            if (!el) return logTextSize * 1.5;
            return el.getBoundingClientRect().height;
        },
        overscan: 20,
    });

    /* useEffect(() => {
        if (!live.length) return;
        if (sticky.isAtBottom) {
            rowVirtualizer.scrollToIndex(live.length - 1, { align: "end" });
        }
    }, [live.length, sticky.isAtBottom, rowVirtualizer]); */

    if (isLoading) return <Loader text={"Загрузка данных"} />;
    if (isError) return <ErrorInformer error={error} />;
    if (!live.length) return <NoData />;

    return (
        <div
            ref={sticky.scrollRef}
            style={{
                maxWidth: "100%",
                height: "100%",
                width: "100%",
                overflow: "auto",
            }}
        >
            <div
                ref={sticky.contentRef}
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {rowVirtualizer.getVirtualItems().map((vi) => (
                    <div
                        key={vi.key}
                        ref={rowVirtualizer.measureElement}
                        data-index={vi.index}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            transform: `translateY(${vi.start}px)`,
                        }}
                    >
                        <LogRow
                            row={live[vi.index]}
                            logTextSize={logTextSize}
                            isLogTextWrapped={isLogTextWrapped}
                        />
                    </div>
                ))}
            </div>
            {!sticky.isAtBottom && (
                <Box position="absolute" bottom="8" right="8" zIndex="10">
                    <IconButton
                        size="sm"
                        onClick={() => {
                            sticky.scrollToBottom("instant");
                            rowVirtualizer.measure();
                        }}
                        colorScheme="blue"
                        variant="solid"
                    >
                        <LuArrowDown />
                    </IconButton>
                </Box>
            )}
        </div>
    );
};

const LogRow = ({ row, logTextSize, isLogTextWrapped }) => {
    return (
        <Text
            as={"div"}
            display={"block"}
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
