import { useMemo } from "react";

const filterColumns = (tableColumns, tableColumnsZus) => {
    if (!tableColumns?.length || !tableColumnsZus?.length) return [];
    const selected = new Set(tableColumnsZus);
    return tableColumns.filter((column) => selected.has(column.value));
};

export const useFilterColumns = (tableColumns, tableColumnsZus) => {
    return useMemo(
        () => filterColumns(tableColumns, tableColumnsZus),
        [tableColumns, tableColumnsZus],
    );
};
