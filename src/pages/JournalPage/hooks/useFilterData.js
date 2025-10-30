import { useMemo } from "react";

const FilterData = (live, selectedGroups, selectedMessages) => {
    if (!live) return [];
    const filteredDataFunc = live.filter((item) => {
        if (!selectedGroups || !selectedMessages) return false;
        return selectedGroups.includes(item.group) && selectedMessages.includes(item.type);
    });
    return filteredDataFunc;
};

export const useFilterData = (live, selectedGroups, selectedMessages) => {
    const FilteredData = useMemo(() => FilterData(live, selectedGroups, selectedMessages), [live, selectedGroups, selectedMessages]);
    return FilteredData;
};