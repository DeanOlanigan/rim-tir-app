import { useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import {
    LuCircleAlert,
    LuInfo,
    LuPause,
    LuPlay,
    LuTriangleAlert,
} from "react-icons/lu";
import { AckButtonCellChakra } from "../JournalView/AckButtonCell";
import { Icon } from "@chakra-ui/react";

const typePalette = {
    info: "var(--chakra-colors-fg-info)",
    warn: "var(--chakra-colors-fg-warning)",
    error: "var(--chakra-colors-fg-error)",
    ts: "var(--chakra-colors-fg-info)",
    tu: "var(--chakra-colors-fg-info)",
    pause: "var(--chakra-colors-fg-success)",
    resume: "var(--chakra-colors-fg-success)",
};

const typeIcon = {
    info: LuInfo,
    warn: LuCircleAlert,
    error: LuTriangleAlert,
    ts: LuInfo,
    tu: LuInfo,
    pause: LuPause,
    resume: LuPlay,
};

export const useCreateTable = (filteredColumns, filteredData) => {
    const columns = useMemo(
        () =>
            filteredColumns.map((column) => ({
                id: column.value,
                accessorKey: column.value,
                header: column.label,
                minSize: column.minSize,
                meta: {
                    grow: column.grow,
                },
                cell: ({ getValue, row }) => {
                    switch (column.value) {
                        case "needAck": {
                            if (!getValue()) return null;
                            return <AckButtonCellChakra id={row.original.id} />;
                        }
                        case "type": {
                            const type = row.original.type;
                            const cellColor = typePalette[type];
                            const CellIcon = typeIcon[type];
                            /* return (
                                CellIcon && (
                                    <CellIcon size={24} color={cellColor} />
                                )
                            ); */
                            return (
                                <Icon
                                    as={CellIcon}
                                    color={cellColor}
                                    size={"lg"}
                                />
                            );
                        }
                        default: {
                            const value = getValue();
                            return String(value ?? "");
                        }
                    }
                },
            })),
        [filteredColumns],
    );

    return useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row, index) => row.id ?? `${row.ts}-${index}`,
    });
};
