import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    columns: [],
    rows: [],
    filters: {},
    user: {
        isAuthenticated: false,
        role: null,
    },
    error: null,
    status: 'idle',
};

const sortedColumns = (columns) =>  {
    return ( columns.length > 0
        ? columns.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        : []
)}

const sortedRows = (rows) =>  {
    return ( rows.length > 0
            ? rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            : []
    )}

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        setColumns: (state, action) => {
            state.columns = sortedColumns(action.payload);
            state.status = 'succeeded';
        },
        createColumn: (state, action) => {
            const newColumns = [...state.columns, action.payload];
            state.columns = sortedColumns(newColumns);
            state.status = 'succeeded';
        },

        changeColumn: (state, action) => {
            const changeColumns = state.columns
                .map(column => (column.id === action.payload.id) ? action.payload: column);
            state.columns = sortedColumns(changeColumns);
            state.status = 'succeeded';
        },

        setRows: (state, action) => {
            state.rows = sortedRows(action.payload);
            state.status = 'succeeded';
        },

        createRow: (state, action) => {
            const newRows = [...state.rows, action.payload];
            state.rows = sortedRows(newRows);
            state.status = 'succeeded';
        },

        setLoading: (state, action) => {
            state.status = action.payload;
        },
        setError: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },

        setFilters: (state, action) => {
            state.filters = action.payload;
        },

        login(state, action) {
            state.user.isAuthenticated = true;
            state.user.role = action.payload;
        },
        logout(state) {
            state.user.isAuthenticated = false;
            state.user.role = null;
        },
    }
});

export const {
    setColumns,
    createColumn,
    changeColumn,
    setRows,
    createRow,
    setLoading,
    setError,
    setFilters,
    login,
    logout
} = tableSlice.actions;

export const selectColumns = (state) => state.table.columns;
export const selectRows = (state) => state.table.rows;
export const selectStatus = (state) => state.table.status;
export const selectError = (state) => state.table.error;
export const selectFilters = (state) => state.table.filters;
export const selectUser = (state) => state.table.user;

export default tableSlice.reducer;
