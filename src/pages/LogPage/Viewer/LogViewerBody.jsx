import { Box, IconButton } from "@chakra-ui/react";
import { NoData } from "@/components/NoData";
import { Loader } from "@/components/Loader";
import { ErrorInformer } from "@/components/ErrorInformer";
import { LOG_LEVELS } from "@/config/constants";
import { useLogData } from "./useLogData";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useStickToBottom } from "use-stick-to-bottom";
import { LuArrowDown } from "react-icons/lu";

const LEVEL_COLOR = {
    [LOG_LEVELS.info]: "var(--chakra-colors-fg-info)",
    [LOG_LEVELS.error]: "var(--chakra-colors-fg-error)",
    [LOG_LEVELS.warn]: "var(--chakra-colors-fg-warning)",
    [LOG_LEVELS.status]: "var(--chakra-colors-fg-success)",
    [LOG_LEVELS.debug]: "var(--chakra-colors-fg)",
};

export const LogViewerBody = () => {
    const {
        q: { isLoading, isError, error },
        live,
        logTextSize,
        isLogTextWrapped,
    } = useLogData();
    const sticky = useStickToBottom({ initial: "instant", resize: "instant" });

    const rowVirtualizer = useVirtualizer({
        count: live.length,
        getScrollElement: () => sticky.scrollRef.current,
        estimateSize: () => logTextSize * 1.5,
        measureElement: (el) => {
            if (!el) return logTextSize * 1.5;
            return el.getBoundingClientRect().height;
        },
        overscan: 10,
    });

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
                {rowVirtualizer.getVirtualItems().map((vi) => {
                    const row = live[vi.index];
                    return (
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
                                whiteSpace: isLogTextWrapped
                                    ? "pre-wrap"
                                    : "pre",
                                fontFamily: "monospace",
                                fontSize: logTextSize,
                                color: LEVEL_COLOR[row.level],
                            }}
                        >
                            {`[${row.ts}]\t${(
                                "[" +
                                row.level.toUpperCase() +
                                "]"
                            )
                                .toString()
                                .padStart(9)}\t${row.message}`}
                        </div>
                    );
                })}
            </div>
            {!sticky.isAtBottom && (
                <Box position="absolute" bottom="12" right="8" zIndex="10">
                    <IconButton
                        size="sm"
                        onClick={() => {
                            sticky.scrollToBottom({ animation: "instant" });
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
