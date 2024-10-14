import {
    getColumns,
    getRows,
    addColumn,
    updateColumn,
    deleteColumn,
    addValues,
    updateValues,
    deleteValues,
    addRow,
    updateRow,
    deleteRow,
    deleteCell,
    addAddition,
    updateAddition,
    deleteAddition
} from '../api';
import {
    setColumns,
    createColumn,
    changeColumn,
    setLoading,
    setError,
    setRows,
    createRow,
} from '../slices';


export const fetchColumns = () => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const columns = await getColumns();
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
        const newColumn = await addColumn();
        dispatch(createColumn(newColumn));
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
        const updatedColumn = await updateColumn(column);
        dispatch(changeColumn(updatedColumn));
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
        const columns = await deleteColumn(id);
        dispatch(setColumns(columns));
        dispatch(setLoading('idle'));
    } catch (error) {
        dispatch(setLoading('error'));
        dispatch(setError(error.toString()));
    }
};

export const addValueToColumnAsync = (columnId, value) => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const newValue = {
            columnId,
            value
        }
        const columns = await addValues(newValue);
        dispatch(setColumns(columns));
        dispatch(setLoading('idle'));
    } catch (error) {
        dispatch(setLoading('error'));
        console.error('Failed to add value to column:', error);
        dispatch(setError(error.toString()));
    }
};

export const updateValueToColumnAsync = (updateData) => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const columns = await updateValues(updateData);
        dispatch(setColumns(columns));
        dispatch(setLoading('idle'));
    } catch (error) {
        dispatch(setLoading('error'));
        console.error('Failed to update value to column:', error);
        dispatch(setError(error.toString()));
    }
};

export const removeValueFromColumnAsync = ( id ) => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const columns = await deleteValues(id);
        dispatch(setColumns(columns));
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
        dispatch(setRows(rows));
        dispatch(setLoading('idle'));
        console.log("fetchRow", rows)
    } catch (error) {
        console.error('Failed to fetch rows:', error);
        dispatch(setError(error.toString()));
    }
};

export const addRowAsync = () => async (dispatch) => {
    dispatch(setLoading());
    try {
        const addedRow = await addRow();
        console.log("addedRow", addedRow);
        if (addedRow) {
            dispatch(createRow(addedRow));
        }
        dispatch(setLoading('idle'));
    } catch (error) {
        console.error('Failed to add row:', error);
        dispatch(setError(error.toString()));
    }
};

export const updateRowAsync = (cellData) => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const updatedRows = await updateRow(cellData);
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
        dispatch(setRows(updatedRows));
        dispatch(setLoading('idle'));
    } catch (error) {
        dispatch(setLoading('error'));
        console.error('Failed to delete row:', error);
        dispatch(setError(error.toString()));
    }
};

export const removeValuesFromRowAsync = (cellData) => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const updatedRows = await deleteCell(cellData);
        dispatch(setRows(updatedRows));
        dispatch(setLoading('idle'));
    } catch (error) {
        dispatch(setLoading('error'));
        console.error('Failed to delete row:', error);
        dispatch(setError(error.toString()));
    }
};

export const addAdditionAsync = (addition) => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const columns = await addAddition(addition);  // console.log("adding addition", columns);
        dispatch(setColumns(columns));

        dispatch(setLoading('idle'));
    } catch  (error) {
        dispatch(setLoading('error'));
        console.error('Failed to add addition:', error);
        dispatch(setError(error.toString()));
    }
};

export const updateAdditionAsync = (addition) => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const columns = await updateAddition(addition);
        dispatch(setColumns(columns));

        dispatch(setLoading('idle'));
    } catch  (error) {
        dispatch(setLoading('error'));
        console.error('Failed to update addition:', error);
        dispatch(setError(error.toString()));
    }
};

export const deleteAdditionAsync = (id) => async (dispatch) => {
    dispatch(setLoading('loading'));
    try {
        const columns = await deleteAddition(id);
        dispatch(setColumns(columns));

        dispatch(setLoading('idle'));
    } catch  (error) {
        dispatch(setLoading('error'));
        console.error('Failed to delete addition:', error);
        dispatch(setError(error.toString()));
    }
};
