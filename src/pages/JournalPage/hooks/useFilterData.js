import { useMemo } from "react";

const filterData = (live, selectedMessages, selectedCategory) => {
    if (!live?.length) return [];
    if (!selectedMessages?.size) return [];

    return live.filter((item) => {
        return (
            selectedMessages.has(item.severity) &&
            selectedCategory.has(item.category)
        );
    });
};

export const useFilterData = (live, selectedMessages, selectedCategory) => {
    return useMemo(
        () => filterData(live, selectedMessages, selectedCategory),
        [live, selectedMessages, selectedCategory],
    );
};
