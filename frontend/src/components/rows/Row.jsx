import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import {useDispatch, useSelector} from 'react-redux';

import {deleteRowAsync} from '../../thunks';
import {selectColumns, selectUser} from "../../slices";
import CrossButton from "../features/CrossButton";
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
            <td className={styles.deleteRow}>
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
            id: PropTypes.string.isRequired,
            rowId: PropTypes.string.isRequired,
            columnId: PropTypes.string.isRequired,
            valueId: PropTypes.string,
            Values: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    columnId: PropTypes.string.isRequired,
                    value: PropTypes.string.isRequired,
                    addition: PropTypes.array
                }))
        })).isRequired,
    }).isRequired
};

export default Row;
