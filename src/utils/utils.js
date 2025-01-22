const startDate = new Date();
startDate.setDate(startDate.getDate() - 3);
startDate.setMinutes(Math.round(startDate.getMinutes() / 15) * 15);

export const getStartDate = () => startDate.getTime();

const endDate = new Date();
endDate.setDate(endDate.getDate());
endDate.setMinutes(Math.round(endDate.getMinutes() / 15) * 15);

export const getEndDate = () => endDate.getTime();

export const getRandomColor = () => {
    return ("#" + (Math.random().toString(16) + "000000").slice(2, 8).toUpperCase());
};
