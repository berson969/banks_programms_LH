import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    columns: [],
    rows: [],
    sortedRows: [],
    filters: {},
    sorting: {},
    user: {
        isAuthenticated: false,
        role: null,
    },
    openPopup: {},
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

        setSortedRows: (state, action) => {
            state.sortedRows = action.payload;
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

        setSorting: (state, action) => {
            state.sorting = action.payload;
        },

        setOpenPopup(state, action) {
            state.openPopup = action.payload;
        },

        toggleOpenPopup: (state, action) => {
            const tuple = action.payload;
            const len = Object.keys(state.openPopup).length;
            if (state.openPopup[tuple] !== undefined && len === 1) {
                state.openPopup[tuple] = !state.openPopup[tuple];
            } else if (len === 0) {
                state.openPopup = {
                    ...state.openPopup,
                    [tuple]: true };
            }
        },

        closeOpenPopup(state) {
            state.openPopup = {};
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
    setSortedRows,
    setLoading,
    setError,
    setFilters,
    setSorting,
    setOpenPopup,
    toggleOpenPopup,
    closeOpenPopup,
    login,
    logout
} = tableSlice.actions;

export const selectColumns = (state) => state.table.columns;
export const selectRows = (state) => state.table.rows;
export const selectSortedRows = (state) => state.table.sortedRows;
export const selectStatus = (state) => state.table.status;
export const selectError = (state) => state.table.error;
export const selectFilters = (state) => state.table.filters;
export const selectSorting = (state) => state.table.sorting;
export const selectOpenPopup = (state) => state.table.openPopup;
export const selectUser = (state) => state.table.user;

export default tableSlice.reducer;
