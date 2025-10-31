import { useMemo } from "react";

const FilterColumns = (tableColumns, tableColumnsZus) => {
    const filteredColumnsFunc = tableColumns.filter((colon) => {
        if (!tableColumnsZus) return false;
        return tableColumnsZus.includes(colon.value);
    });
    return filteredColumnsFunc;
};

export const useFilterColumns = (tableColumns, tableColumnsZus) => {
    const filteredColumns = useMemo(
        () => FilterColumns(tableColumns, tableColumnsZus),
        [tableColumns, tableColumnsZus]
    );
    return filteredColumns;
};
