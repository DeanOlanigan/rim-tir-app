import { useAuth } from "@/hooks/useAuth";
import { useCreateTable } from "../hooks/useCreateTable";
import { useStickToBottom } from "use-stick-to-bottom";
import { useCallback, useState } from "react";
import { NoData } from "@/components/NoData";
import { Box, IconButton } from "@chakra-ui/react";
import { JournalTableContent } from "./JournalTableContent";
import { LuArrowDown } from "react-icons/lu";

export const JournalLiveTableBase = ({
    columns,
    data,
    renderHeaderContent,
}) => {
    const { user } = useAuth();
    const table = useCreateTable(columns, data, user);
    const rows = table.getRowModel().rows;

    const { scrollRef, contentRef, isAtBottom, scrollToBottom } =
        useStickToBottom({
            initial: "instant",
            resize: "instant",
        });

    const [scrollElement, setScrollElement] = useState(null);

    const setScrollNode = useCallback(
        (node) => {
            setScrollElement(node);
            scrollRef(node);
        },
        [scrollRef],
    );

    if (!columns?.length) return <NoData />;

    return (
        <Box w="full" h="full" minH={0} position="relative">
            <Box
                ref={setScrollNode}
                overflow="auto"
                position="relative"
                w="full"
                h="full"
                minH={0}
            >
                <JournalTableContent
                    columns={columns}
                    rows={rows}
                    renderHeaderContent={renderHeaderContent}
                    user={user}
                    scrollElement={scrollElement}
                    contentRef={contentRef}
                />
            </Box>

            {!isAtBottom && (
                <Box position="absolute" bottom="2" right="2" zIndex="overlay">
                    <IconButton
                        size="sm"
                        onClick={() => scrollToBottom({ animation: "instant" })}
                        variant="solid"
                    >
                        <LuArrowDown />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};
