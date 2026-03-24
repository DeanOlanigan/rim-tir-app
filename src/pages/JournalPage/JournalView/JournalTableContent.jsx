import { Box } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { flexRender } from "@tanstack/react-table";
import { memo } from "react";

const ROW_HEIGHT = 36;
const OVERSCAN = 10;

export const JournalTableContent = memo(function JournalTableContent({
    columns,
    rows,
    user,
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
                user={user}
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
                    const isWarning = row.original.severity === "warning";
                    const isError =
                        row.original.severity === "error" ||
                        row.original.severity === "critical";
                    const isNeedAck = row.original.ack?.state === "pending";

                    let bg = "inherit";
                    if (isError) bg = "var(--chakra-colors-bg-error)";
                    else if (isWarning) bg = "var(--chakra-colors-bg-warning)";
                    else if (isNeedAck) bg = "var(--chakra-colors-bg-info)";

                    return (
                        <tr
                            key={row.id}
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
                                return (
                                    <td
                                        key={cell.id}
                                        style={{
                                            minWidth:
                                                cell.column.columnDef.minSize,
                                            flexGrow:
                                                cell.column.columnDef.meta
                                                    .grow ?? 1,
                                            flexBasis:
                                                cell.column.columnDef.minSize,
                                            alignContent: "center",
                                            padding: "0 8px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            fontWeight: "500",
                                            fontSize: "0.875rem",
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
                })}
            </tbody>
        </table>
    );
});

const defaultRenderHeaderContent = ({ column }) => column.label;

const TableHeader = memo(function TableHeader({
    columns,
    user,
    renderHeaderContent,
}) {
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
                        {renderContent({ column, user })}
                    </Box>
                ))}
            </tr>
        </thead>
    );
});
