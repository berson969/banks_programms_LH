import PropTypes from 'prop-types';
import ColumnNameInput from './ColumnNameInput';
import ValuesList from './ValuesList';
import AddValueInput from './AddValueInput';

function Columns({ column }) {
    // console.log('updateColumn-Columns', column, column.id)
    return (
        <div  className="column-view">
            <ColumnNameInput
                id={`name-${column.id}`}
                column={column}
            />
            <ValuesList
                Values={column.Values}
            />
            <AddValueInput column={column} />
        </div>
    );
}

Columns.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        Values: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                columnId: PropTypes.string,
                value: PropTypes.string
            })
        )
    }).isRequired
};

export default Columns;
