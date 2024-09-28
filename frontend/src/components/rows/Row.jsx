import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';

import {deleteRowAsync} from '../../thunks';
import {selectColumns, selectUser} from "../../slices";
import CrossButton from "../CrossButton";
import RowCell from './RowCell';


function Row ({ row }) {
    const dispatch = useDispatch();
    const columns = useSelector(selectColumns);
    const { role } = useSelector(selectUser);

    const handleDeleteRow = () => {
        dispatch(deleteRowAsync(row.id));
    };

    return (
        <tr key={row.id}>
            {columns && columns.map(column => (
                <RowCell
                    key={column.id}
                    column={column}
                    row={row}
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
            valueId: PropTypes.string
        })).isRequired,
    }).isRequired
};

export default Row;
