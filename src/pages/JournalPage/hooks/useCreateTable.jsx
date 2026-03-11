import { useMemo } from "react";
import { Badge, Icon } from "@chakra-ui/react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import {
    LuCircleAlert,
    LuInfo,
    LuPause,
    LuPlay,
    LuTriangleAlert,
} from "react-icons/lu";

const groupPalette = {
    noGroup: "gray",
    danger: "red",
    warn: "orange",
    state: "blue",
    pause: "cyan",
    resume: "green",
};

const groupText = {
    noGroup: "Без группы",
    danger: "Аварийные",
    warn: "Предупредительные",
    state: "Оперативные",
    pause: "Пауза",
    resume: "Возобновлен",
};

const typePalette = {
    info: "fg.info",
    warn: "fg.warning",
    error: "fg.error",
    ts: "blue",
    tu: "blue",
    pause: "green",
    resume: "green",
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

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
});

function formatJournalDate(value) {
    if (!value) return "";
    return dateFormatter.format(new Date(value));
}

export const useCreateTable = (filteredColumns, filteredData) => {
    const columns = useMemo(
        () =>
            filteredColumns.map((column) => ({
                id: column.value,
                accessorKey: column.value,
                size: column.size,
                header: column.label,
                cell: ({ getValue, row }) => {
                    switch (column.value) {
                        case "ts":
                        case "ack_time":
                            return formatJournalDate(getValue());
                        case "group": {
                            const value = row.original.group;
                            return (
                                <Badge
                                    w={"full"}
                                    justifyContent={"center"}
                                    colorPalette={groupPalette[value]}
                                    variant={"solid"}
                                >
                                    {groupText[value]}
                                </Badge>
                            );
                        }
                        case "type": {
                            const value = row.original.type;
                            return (
                                <Icon
                                    as={typeIcon[value]}
                                    color={typePalette[value]}
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
