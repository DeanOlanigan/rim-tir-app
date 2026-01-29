export const useData = (data) => {
    if (!data) return [];
    const returnData = data.live.filter((u) => {
        return data.selectedRows.includes(u.login);
    });
    return returnData;
};
