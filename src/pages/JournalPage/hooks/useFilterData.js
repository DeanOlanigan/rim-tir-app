import { useMemo } from "react";

const FilterData = (live, selectedGroups, selectedMessages) => {
    if (!live) return [];
    if (!selectedGroups || !selectedMessages) return false;
    const filteredDataFunc = live.filter((item) => {
        return (
            selectedGroups.includes(item.group) &&
            selectedMessages.includes(item.type)
        );
    });
    return filteredDataFunc;
};

export const useFilterData = (live, selectedGroups, selectedMessages) => {
    const FilteredData = useMemo(
        () => FilterData(live, selectedGroups, selectedMessages),
        [live, selectedGroups, selectedMessages],
    );
    return FilteredData;
};
