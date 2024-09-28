export const saveDataToLocalStorage = (LOCAL_STORAGE_KEY, saveData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData));
};

export const getDataFromLocalStorage = (LOCAL_STORAGE_KEY) => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
};

export const removeDataFromLocalStorage = (LOCAL_STORAGE_KEY) => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};
