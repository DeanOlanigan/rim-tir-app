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

const filterDataM = (live, selectedMessages) => {
    if (!live?.length) return [];
    if (!selectedMessages?.size) return [];

    return live.filter((item) => {
        return selectedMessages.has(item.severity);
    });
};

export const useFilterData = (live, selectedGroups, selectedMessages) => {
    return useMemo(
        () => filterData(live, selectedGroups, selectedMessages),
        [live, selectedGroups, selectedMessages],
    );
};

export const useFilterDataM = (live, selectedMessages) => {
    return useMemo(
        () => filterDataM(live, selectedMessages),
        [live, selectedMessages],
    );
};
