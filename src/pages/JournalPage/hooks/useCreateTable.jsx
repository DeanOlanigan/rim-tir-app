import { useMemo } from "react";
import { Text, Badge } from "@chakra-ui/react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

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
                            Аварийная: "red",
                            Предупредительная: "orange",
                            Состояние: "blue",
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
                    if (column.value === "date") {
                        return <Text>{new Date(value).toLocaleString()}</Text>;
                    }
                    return (
                        <Text truncate title={value}>
                            {value}
                        </Text>
                    );
                },
            })),
        [filtreColon]
    );

    const table = useReactTable({
        data: filtredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return table;
};
