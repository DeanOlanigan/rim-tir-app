import { Box, IconButton } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useStickToBottom } from "use-stick-to-bottom";
import { NoData } from "@/components/NoData";
import { useCreateTable } from "../hooks/useCreateTable";
import { LuArrowDown } from "react-icons/lu";
import { flexRender } from "@tanstack/react-table";
import { memo, useCallback, useState } from "react";
import {
    JOURNAL_INFO_DRAWER_ID,
    journalAdditionalInfoDrawer,
} from "@/journalAdditionalInfoDrawer";

const ROW_HEIGHT = 36;
const OVERSCAN = 10;

export const JournalTableBase = ({ columns, data, renderHeaderContent }) => {
    const table = useCreateTable(columns, data);
    const rows = table.getRowModel().rows;

    if (!columns?.length) return <NoData />;

    return (
        <StickToBottomShell>
            {({ contentRef, scrollElement }) => (
                <JournalTableContent
                    columns={columns}
                    rows={rows}
                    renderHeaderContent={renderHeaderContent}
                    contentRef={contentRef}
                    scrollElement={scrollElement}
                />
            )}
        </StickToBottomShell>
    );
};

function StickToBottomShell({ children }) {
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
                {children({ contentRef, scrollElement })}
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
}

const JournalTableContent = memo(function JournalTableContent({
    columns,
    rows,
    renderHeaderContent,
    contentRef,
    scrollElement,
}) {
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollElement,
        estimateSize: () => ROW_HEIGHT,
        overscan: OVERSCAN,
        getItemKey: (index) => rows[index]?.id ?? index,
    });

    const virtualRows = rowVirtualizer.getVirtualItems();

    return (
        <table
            style={{
                display: "grid",
                width: "100%",
                minWidth: "700px",
            }}
        >
            <TableHeader
                columns={columns}
                renderHeaderContent={renderHeaderContent}
            />
            <tbody
                ref={contentRef}
                style={{
                    display: "grid",
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {virtualRows.map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    return (
                        <TableRow
                            key={row.id}
                            row={row}
                            virtualRow={virtualRow}
                        />
                    );
                })}
            </tbody>
        </table>
    );
});

const defaultRenderHeaderContent = (column) => column.label;

const TableHeader = memo(({ columns, renderHeaderContent }) => {
    const renderContent = renderHeaderContent ?? defaultRenderHeaderContent;

    return (
        <thead
            style={{
                display: "grid",
                position: "sticky",
                width: "100%",
                top: 0,
                zIndex: 10,
            }}
        >
            <tr
                style={{
                    display: "flex",
                    width: "100%",
                }}
            >
                {columns.map((column) => (
                    <Box
                        as="th"
                        key={column.value}
                        display={"flex"}
                        justifyContent={"center"}
                        bg="colorPalette.muted"
                        py="1"
                        fontWeight="medium"
                        fontSize={16}
                        style={{
                            minWidth: column.minSize,
                            flexGrow: column.grow ?? 1,
                            flexBasis: column.minSize,
                        }}
                        _first={{
                            borderTopLeftRadius: "l2",
                            borderBottomLeftRadius: "l2",
                        }}
                        _last={{
                            borderTopRightRadius: "l2",
                            borderBottomRightRadius: "l2",
                        }}
                    >
                        {renderContent(column)}
                    </Box>
                ))}
            </tr>
        </thead>
    );
});
TableHeader.displayName = "TableHeader";

const TableRow = ({ row, virtualRow }) => {
    const isWarning = row.original.severity === "warning";
    const isError =
        row.original.severity === "error" ||
        row.original.severity === "critical";
    const isNeedAck = row.original.ack?.state === "pending";

    let bg;
    if (isError) bg = "var(--chakra-colors-bg-error)";
    else if (isWarning) bg = "var(--chakra-colors-bg-warning)";
    else if (isNeedAck) bg = "var(--chakra-colors-bg-info)";

    return (
        <tr
            data-index={virtualRow.index}
            style={{
                display: "flex",
                position: "absolute",
                transform: `translateY(${virtualRow.start}px)`,
                width: "100%",
                height: `${virtualRow.size}px`,
                background: bg,
            }}
        >
            {row.getVisibleCells().map((cell) => {
                const isInfo = cell.column.id === "info";
                const infoStyle = isInfo ? { cursor: "pointer" } : undefined;
                return (
                    <td
                        key={cell.id}
                        style={{
                            minWidth: cell.column.columnDef.minSize,
                            flexGrow: cell.column.columnDef.meta.grow ?? 1,
                            flexBasis: cell.column.columnDef.minSize,
                            alignContent: "center",
                            padding: "0 8px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            ...infoStyle,
                        }}
                        onClick={() => {
                            if (isInfo)
                                journalAdditionalInfoDrawer.open(
                                    JOURNAL_INFO_DRAWER_ID,
                                    { event: cell.row.original },
                                );
                        }}
                    >
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                        )}
                    </td>
                );
            })}
        </tr>
    );
};
