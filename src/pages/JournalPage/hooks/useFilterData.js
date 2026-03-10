import { useMemo } from "react";

const filterData = (live, selectedGroups, selectedMessages) => {
    if (!live?.length) return [];
    if (!selectedGroups?.size || !selectedMessages?.size) return [];

    return live.filter((item) => {
        return (
            selectedGroups.has(item.group) && selectedMessages.has(item.type)
        );
    });
};

export const useFilterData = (live, selectedGroups, selectedMessages) => {
    return useMemo(
        () => filterData(live, selectedGroups, selectedMessages),
        [live, selectedGroups, selectedMessages],
    );
};
