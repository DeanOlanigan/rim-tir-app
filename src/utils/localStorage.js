export const getFromLocalStorage = (key, defaultValue) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
};

export const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};
