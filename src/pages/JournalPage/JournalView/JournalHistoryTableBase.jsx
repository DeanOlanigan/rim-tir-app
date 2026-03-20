import { useAuth } from "@/hooks/useAuth";
import { useCreateTable } from "../hooks/useCreateTable";
import { useCallback, useState } from "react";
import { NoData } from "@/components/NoData";
import { Box } from "@chakra-ui/react";
import { JournalTableContent } from "./JournalTableContent";

export const JournalHistoryTableBase = ({
    columns,
    data,
    renderHeaderContent,
    containerRef,
    onScroll,
}) => {
    const { user } = useAuth();
    const table = useCreateTable(columns, data, user);
    const rows = table.getRowModel().rows;
    const [scrollElement, setScrollElement] = useState(null);

    const setScrollNode = useCallback(
        (node) => {
            setScrollElement(node);

            if (!containerRef) return;
            if (typeof containerRef === "function") {
                containerRef(node);
            } else {
                containerRef.current = node;
            }
        },
        [containerRef],
    );

    if (!columns?.length) return <NoData />;

    return (
        <Box
            ref={setScrollNode}
            onScroll={onScroll}
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
            />
        </Box>
    );
};
