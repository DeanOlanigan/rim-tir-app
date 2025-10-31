import { Box, IconButton, ScrollArea, Text } from "@chakra-ui/react";
import { useStickToBottom } from "use-stick-to-bottom";
import { LuArrowDown } from "react-icons/lu";
import { NoData } from "@/components/NoData";
import { Loader } from "@/components/Loader";
import { ErrorInformer } from "@/components/ErrorInformer";
import { LOG_LEVELS } from "@/config/constants";
import { useLogData } from "./useLogData";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const LEVEL_COLOR = {
    [LOG_LEVELS.info]: "blue.500",
    [LOG_LEVELS.error]: "red.500",
    [LOG_LEVELS.warn]: "yellow.500",
    [LOG_LEVELS.status]: "green.500",
    [LOG_LEVELS.debug]: "gray.500",
};

const MIN_THUMB = 20;

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
    scrollbarGutter: "stable both-edges",
    overflow: "auto",
};

export const LogViewerBody = () => {
    const {
        q: { isLoading, isError, error },
        live,
        logTextSize,
        isLogTextWrapped,
    } = useLogData();
    //const sticky = useStickToBottom();
    const viewportRef = useRef(null);

    const [thumbH, setThumbH] = useState(null);

    const rowVirtualizer = useVirtualizer({
        count: live.length,
        getScrollElement: () => sticky.scrollRef.current,
        estimateSize: () => logTextSize * 1.5,
        measureElement: (el) => {
            if (!el) return logTextSize * 1.5;
            return el.getBoundingClientRect().height;
        },
        overscan: 20,
        shouldAdjustScrollPositionOnItemSizeChange: true,
    });

    /* useEffect(() => {
        if (!live.length) return;
        if (sticky.isAtBottom) {
            rowVirtualizer.scrollToIndex(live.length - 1, { align: "end" });
        }
    }, [live.length, sticky.isAtBottom, rowVirtualizer]); */

    const contentProps = useMemo(
        () => ({
            style: {
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
            },
        }),
        [rowVirtualizer.getTotalSize()]
    );

    const getItemProps = useCallback(
        (item) => ({
            'data-index': item.index,
            style: {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${item.start}px)`,
            },
        }),
        []
    );

    if (isLoading) return <Loader text={"Загрузка данных"} />;
    if (isError) return <ErrorInformer error={error} />;

    return (
        <ScrollArea.Root
            variant={"always"}
            css={{ "--thumb-height": "initial !important" }}
        >
            <ScrollArea.Viewport ref={viewportRef} css={shadowCss}>
                <ScrollArea.Content
                    style={{
                        height: `${totalSize}px`,
                        width: "100%",
                        position: "relative",
                        minWidth: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    {live.length === 0 ? (
                        <NoData />
                    ) : (
                        rowVirtualizer.getVirtualItems().map((vi) => (
                            <div 
                                key={vi.key}
                                ref={rowVirtualizer.measureElement} 
                                {...getItemProps(vi)} >
                                <LogRow
                                    row={live[vi.index]}
                                    logTextSize={logTextSize}
                                    isLogTextWrapped={isLogTextWrapped}
                                />
                            </Box>
                        ))
                    )}
                </ScrollArea.Content>
            </ScrollArea.Viewport>

            {/* {!sticky.isAtBottom && (
                <Box position="absolute" bottom="4" right="4" zIndex="10">
                    <IconButton
                        size="sm"
                        onClick={() => {
                            sticky.scrollToBottom();
                            rowVirtualizer.measure();
                        }}
                        colorScheme="blue"
                        variant="solid"
                    >
                        <LuArrowDown />
                    </IconButton>
                </Box>
            )} */}
            <ScrollArea.Corner />
        </ScrollArea.Root>
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