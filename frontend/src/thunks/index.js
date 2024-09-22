import {
    getColumns,
    getRows,
    addColumn,
    updateColumn,
    deleteColumn,
    addRow,
    updateRow,
    deleteRow
} from '../api';
import {
    setColumns,
    addColumnName,
    removeColumn,
    updateColumnName,
    updateValueInColumn,
    removeValueFromColumn,
    setLoading,
    setError,
    selectColumns,
    setRows,
    addRowValue,
    selectRows,
} from '../slices';


export const fetchColumns = () => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const columns = await getColumns();
        console.log("fetchColumns", columns)
        dispatch(setColumns(columns));
        dispatch(setLoading('idle'));
    } catch (error) {
        dispatch(setLoading('error'));
        console.error('Failed to fetch columns:', error);
        dispatch(setError(error.toString()));
    }
};

export const addColumnAsync = () => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const column = {
            name: '',
            createdAt: new Date().toISOString(),
            values: []
        };
        const newColumn = await addColumn(column);
        // console.log('newCol-add', newColumn.id)
        dispatch(addColumnName(newColumn));
        dispatch(setLoading('idle'));
    } catch (error) {
        dispatch(setLoading('error'));
        console.error('Failed to add column:', error);
        dispatch(setError(error.toString()));
    }
};

export const updateColumnAsync = (column) => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        console.log('updatedColumn-thunks', column.id)
        await updateColumn(column)
        dispatch(updateColumnName(column));
        dispatch(setLoading('idle'));
    } catch (error) {
        dispatch(setLoading('error'));
        console.error('Failed to update column name:', error);
        dispatch(setError(error.toString()));
    }
};

export const deleteColumnAsync = (id) => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        await deleteColumn(id);
        dispatch(removeColumn(id));
        dispatch(setLoading('idle'));
    } catch (error) {
        dispatch(setLoading('error'));
        dispatch(setError(error.toString()));
    }
};

export const updateValueToColumnAsync = (id, newValue, oldValue='') => async (dispatch, getState) => {
    dispatch(setLoading('loading'));
    try {
        const state = getState();
        const columns = selectColumns(state);

        const changedColumn = columns.find(column => column.id === id);
        if (!changedColumn) {
            throw new Error(`Column with id ${id} not found`);
        }
        const newValues = changedColumn.values.filter(value => value !== oldValue);

        const updatedColumn = {
            ...changedColumn,
            values: [...newValues, newValue]
        }
        console.log('updatedColumn', updatedColumn)
        await updateColumn(updatedColumn);
        dispatch(updateValueInColumn(updatedColumn));
        dispatch(setLoading('idle'));
    } catch (error) {
        dispatch(setLoading('error'));
        console.error('Failed to add value to column:', error);
        dispatch(setError(error.toString()));
    }
};

export const removeValueFromColumnAsync = ( id, valueToRemove ) => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const columns = await getColumns();
        const column = columns.find(column => column.id === id);

        const updatedColumn = {
            ...column,
            values: column.values.filter(value => value !== valueToRemove)
        }
        await updateColumn(updatedColumn);
        dispatch(removeValueFromColumn({ id, valueToRemove }));
        dispatch(clearRelatedDataAsync(id, valueToRemove));
        dispatch(setLoading('idle'));
    } catch (error) {
        dispatch(setLoading('error'));
        console.error('Failed to remove value from column:', error);
        dispatch(setError(error.toString()));
    }
};

export const fetchRows = () => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const rows = await getRows();
        console.log("fetchRows", rows)
        dispatch(setRows(rows));
        dispatch(setLoading('idle'));
        console.log("fetchRow", rows)
    } catch (error) {
        console.error('Failed to fetch rows:', error);
        dispatch(setError(error.toString()));
    }
};

export const addRowAsync = () => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const state = getState();
        const columns = selectColumns(state);

        const newRow = {
            cellValues: columns.reduce((total, column) => {
                total[column.id] = '';
                return total;
            }, {})
        };

        const addedRow = await addRow(newRow);
        dispatch(addRowValue(addedRow));
        dispatch(setLoading('idle'));
    } catch (error) {
        console.error('Failed to add row:', error);
        dispatch(setError(error.toString()));
    }
};

export const updateRowAsync = (rowData) => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        console.log("updateRowAsync-rowData", rowData)
        const updatedRows = await updateRow(rowData);
        console.log("row-updateRowAsync", updatedRows)
        dispatch(setRows(updatedRows));
        dispatch(setLoading('idle'));
    } catch (error) {
        dispatch(setLoading('error'));
        console.error('Failed to update row:', error);
        dispatch(setError(error.toString()));
    }
};

export const deleteRowAsync = (rowId) => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const updatedRows = await deleteRow(rowId);
        console.log('updatedRows', updatedRows);
        dispatch(setRows(updatedRows));
        dispatch(setLoading('idle'));
    } catch (error) {
        dispatch(setLoading('error'));
        console.error('Failed to delete row:', error);
        dispatch(setError(error.toString()));
    }
};

const clearRelatedDataAsync = (columnId, oldValue) => async (dispatch, getState) => {
    dispatch(setLoading('loading'));
    try {
        const state = getState();
        const currentRows = selectRows(state);

        const updatedRows = await Promise.all(currentRows.map(async (row) => {
            if (row[columnId] === oldValue) {
                const updatedRow = { ...row, [columnId]: '' };
                return await updateRow(row.id, updatedRow);
            }
            return row;
        }));

        dispatch(setRows(updatedRows));
        dispatch(setLoading('idle'));
    } catch (error) {
        console.error('Failed to clear related data:', error);
        dispatch(setError(error.toString()));
    }
};
