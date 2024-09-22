import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getColumns = async () => {
    const response = await axios.get(`${API_URL}/columns`);
    return response.data;
};

export const addColumn = async (column) => {
    const response = await axios.post(`${API_URL}/columns`, column);
    return response.data;
};

export const updateColumn = async (column) => {
    console.log("columnUPDATE", column)
    const response = await axios.put(`${API_URL}/columns/${column.id}`, column);
    return response.data;
};

export const deleteColumn = async (id) => {
    await axios.delete(`${API_URL}/columns/${id}`);
};

export const getRows = async () => {
    const response = await axios.get(`${API_URL}/rows`);
    return response.data;
};

export const addRow = async (row) => {
    const response = await axios.post(`${API_URL}/rows`, row);
    return response.data;
};

export const updateRow = async (rowData) => {
    const response = await axios.put(`${API_URL}/rows/${rowData.rowId}`, rowData);
    return response.data;
};

export const deleteRow = async (id) => {
    const response = await axios.delete(`${API_URL}/rows/${id}`);
    return response.data;
};

export const checkPassword = async (password) => {
    const response = await axios.post(`${API_URL}/password`, password);
    return response.data;
}
