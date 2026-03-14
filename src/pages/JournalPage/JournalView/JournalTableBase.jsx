import { Box, IconButton } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useStickToBottom } from "use-stick-to-bottom";
import { NoData } from "@/components/NoData";
import { useCreateTable } from "../hooks/useCreateTable";
import { LuArrowDown } from "react-icons/lu";
import { flexRender } from "@tanstack/react-table";
import { memo } from "react";
import {
    JOURNAL_INFO_DRAWER_ID,
    journalAdditionalInfoDrawer,
} from "@/journalAdditionalInfoDrawer";

const ROW_HEIGHT = 36;
const OVERSCAN = 10;

export const JournalTableBase = ({ columns, data, renderHeaderContent }) => {
    const sticky = useStickToBottom({
        initial: "instant",
        resize: "instant",
    });

    if (!columns?.length) return <NoData />;

    return (
        <Box w={"full"} h={"full"} minH={0} position={"relative"}>
            <Box
                ref={sticky.scrollRef}
                overflow={"auto"}
                position={"relative"}
                w={"full"}
                h={"full"}
                minH={0}
            >
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
                    <TableBody
                        filteredColumns={columns}
                        data={data}
                        sticky={sticky}
                    />
                </table>
            </Box>
            <ScrollToBottomButton
                isAtBottom={sticky.isAtBottom}
                onClick={() => sticky.scrollToBottom("instant")}
            />
        </Box>
    );
};

const ScrollToBottomButton = memo(({ isAtBottom, onClick }) => {
    if (isAtBottom) return null;

    return (
        <Box
            position="absolute"
            float="right"
            bottom="2"
            right="2"
            zIndex="overlay"
        >
            <IconButton size="sm" onClick={onClick} variant="solid">
                <LuArrowDown />
            </IconButton>
        </Box>
    );
});
ScrollToBottomButton.displayName = "ScrollToBottomButton";

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
TableHeader.displayName = "JournalHeader";

const TableBody = memo(({ filteredColumns, data, sticky }) => {
    const table = useCreateTable(filteredColumns, data);

    const { rows } = table.getRowModel();

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => sticky.scrollRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: OVERSCAN,
        getItemKey: (index) => rows[index]?.id ?? index,
    });

    const virtualRows = rowVirtualizer.getVirtualItems();

    return (
        <tbody
            ref={sticky.contentRef}
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
                    <TableRow key={row.id} row={row} virtualRow={virtualRow} />
                );
            })}
        </tbody>
    );
});
TableBody.displayName = "JournalBody";

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
            key={row.id}
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
                                    { eventId: cell.row.id },
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
