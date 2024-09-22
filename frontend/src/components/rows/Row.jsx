import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import RowCell from './RowCell.jsx';
import {deleteRowAsync, updateRowAsync} from '../../thunks/index.js';
import {selectColumns, selectUser} from "../../slices/index.js";
import CrossButton from "../CrossButton.jsx";


function Row ({ row }) {
    const dispatch = useDispatch();
    const columns = useSelector(selectColumns);
    const { role } = useSelector(selectUser);

    function getCellValueByColumnId(row, columnId) {
        const cellValueObject = row.cellValues.find(cell => cell.columnId === columnId);
        return cellValueObject ? cellValueObject.cellValue : '';
    }

    const handleChange = (columnId, value) => {
        console.log('handleChange-Row', columnId, value, row)
        const updateData = { rowId: row.id, columnId, value };
        dispatch(updateRowAsync(updateData));
    };

    const handleDeleteRow = () => {
        dispatch(deleteRowAsync(row.id));
    };

    return (
        <tr key={row.id}>
            {columns && columns.map(column => (
                <RowCell
                    key={column.id}
                    column={column}
                    value={getCellValueByColumnId(row, column.id)}
                    onChange={handleChange}
                />
            ))}
            {role === 'admin' &&
            <td className="deleteRow">
                <CrossButton
                    onRemoveValue={handleDeleteRow}
                    index={row.id}
                />
            </td>
            }
        </tr>
    );
};

Row.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.string.isRequired,
        cellValues: PropTypes.arrayOf(PropTypes.shape({
            rowId: PropTypes.string.isRequired,
            columnId: PropTypes.string.isRequired,
            cellValue: PropTypes.string.isRequired
        })).isRequired,
    }).isRequired
};

export default Row;
