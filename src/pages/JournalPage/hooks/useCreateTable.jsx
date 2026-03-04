import { useMemo } from "react";
import { Text, Badge, Box } from "@chakra-ui/react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { MenuTypes } from "../JournalFilter/MenuFilters/MenuTypes";
import { MenuGroups } from "../JournalFilter/MenuFilters/MenuGroups";

export const useCreateTable = (filtreColon, filtredData) => {
    const columns = useMemo(
        () =>
            filtreColon.map((column) => ({
                accessorKey: column.value,
                header: column.label,
                size: column.size,
                cell: ({ getValue }) => {
                    const value = getValue();

                    if (column.value === "group") {
                        const colorScheme = {
                            danger: "red",
                            warn: "orange",
                            state: "blue",
                            Пауза: "cyan",
                            Возобновлен: "green",
                        }[value];

                        return (
                            <Badge
                                colorPalette={colorScheme}
                                variant={"subtle"}
                                fontSize={"500"}
                            >
                                {value}
                            </Badge>
                        );
                    }
                    if (column.value === "ts") {
                        return <Text>{new Date(value).toLocaleString()}</Text>;
                    }
                    return (
                        <Text truncate title={value}>
                            {value}
                        </Text>
                    );
                },
            })),
        [filtreColon],
    );

    const table = useReactTable({
        data: filtredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return table;
};

const cellType = {
    group: (content) => <MenuGroups name={content} />,
    type: (content) => <MenuTypes name={content} />,
};

export const HeaderCell = ({ header }) => {
    if (header.isPlaceholder) return null;

    const content = flexRender(
        header.column.columnDef.header,
        header.getContext(),
    );

    return (
        <Box
            as="th"
            key={header.id}
            bg="colorPalette.solid"
            color="fg.inverted"
            w={`${header.getSize()}px`}
            py="1"
            fontWeight="medium"
        >
            {cellType[header.id] ? cellType[header.id](content) : content}
        </Box>
    );
};

export const TableData = ({ virtualRows, rows }) => {
    return (
        <>
            {virtualRows.map((virtualRow) => {
                if (!rows) return null;
                const row = rows[virtualRow.index];
                return (
                    <tr
                        key={row.id}
                        style={{
                            height: `${virtualRow.size}px`,
                        }}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <td
                                key={cell.id}
                                style={{
                                    textAlign: "center",
                                    fontSize: "sm",
                                    fontWeight: "500",
                                    padding: "4px",
                                }}
                            >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                )}
                            </td>
                        ))}
                    </tr>
                );
            })}
        </>
    );
};
