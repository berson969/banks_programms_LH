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
        addColumnName: (state, action) => {
            state.columns.push({
                id: action.payload.id,
                name: action.payload.name,
                createdAt: new Date().toISOString(),
                values: []
            });
            state.columns = sortedColumns(state.columns)
        },
        removeColumn: (state, action) => {
            state.columns = state.columns.filter(column => column.id !== action.payload);
            state.columns = sortedColumns(state.columns);
        },
        updateColumnName: (state, action) => {
            const index = state.columns.findIndex(column => column.id === action.payload.id);
            if (index !== -1) {
                state.columns[index] = {
                    ...state.columns[index],
                    name: action.payload.name
                };
            }
            state.columns = sortedColumns(state.columns);
        },
        updateValueInColumn: (state, action) => {
            state.columns = state.columns.map(col => col.id === action.payload.id ? action.payload : col);
            state.columns = sortedColumns(state.columns);
        },
        removeValueFromColumn: (state, action) => {
            const {id, valueToRemove} = action.payload;
            const column = state.columns.find(column => column.id === id);
            if (column) {
                column.values = column.values.filter(value => value !== valueToRemove);
            }
            state.columns = sortedColumns(state.columns);
        },

        setRows: (state, action) => {
            console.log("RowS", action.payload);
            state.rows = sortedRows(action.payload);
            state.status = 'succeeded';
        },
        addRowValue: (state, action) => {
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
    addColumnName,
    removeColumn,
    updateColumnName,
    removeValueFromColumn,
    updateValueInColumn,
    setRows,
    addRowValue,
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
