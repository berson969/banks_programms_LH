import axios from 'axios';

const API_HOST = import.meta.env.VITE_API_HOST || '91.109.202.105';
console.log(" API_HOST" ,  API_HOST);
const API_URL = `http://${API_HOST}:3000/api`;

export const getColumns = async () => {
    const response = await axios.get(`${API_URL}/columns`);
    return response.data;
};

export const addColumn = async (column) => {
    // name
    const response = await axios.post(`${API_URL}/columns`, column, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const updateColumn = async (column) => {
    // id column, name, createdAt
    const response = await axios.put(`${API_URL}/columns/${column.id}`, column);
    return response.data;
};

export const deleteColumn = async (id) => {
    const response = await axios.delete(`${API_URL}/columns/${id}`);
    return response.data;
};

export const addValues = async (values) => {
      // id values не обязательно, columnId, value
    const response = await axios.post(`${API_URL}/values`, values);
    return response.data;
};

export const updateValues = async (updateValues) => {
    // id values, value
    const response = await axios.put(`${API_URL}/values/${updateValues.id}`, updateValues);
    return response.data;
};

export const deleteValues = async (id) => {
    // values.id
    const response = await axios.delete(`${API_URL}/values/${id}`);
    return response.data;
};

export const getRows = async () => {
    const response = await axios.get(`${API_URL}/rows`);
    return response.data;
};

export const addRow = async () => {
    const response = await axios.post(`${API_URL}/rows`);
    if (response.status === 201) {
        return response.data;
    } else {
        return null;
    }
};

export const updateRow = async (cellData) => {
    // rowId, columnId, valuesId
    const response = await axios.put(`${API_URL}/rows/${cellData.rowId}`, cellData);
    return response.data;
};

export const deleteRow = async (id) => {
    // id row
    const response = await axios.delete(`${API_URL}/rows/${id}`);
    return response.data;
};

export const deleteCell = async (cellData) => {
    // id cellId
    const response = await axios.delete(`${API_URL}/cells/${cellData.id}`);
    return response.data;
};

export const checkPassword = async (password) => {
    const response = await axios.post(`${API_URL}/password`, password);
    return response.data;
}
