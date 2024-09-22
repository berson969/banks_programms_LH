import PropTypes from 'prop-types';
import ColumnNameInput from './ColumnNameInput';
import ValuesList from './ValuesList';
import AddValueInput from './AddValueInput';

function Columns({ column }) {

    // console.log('updateColumn', column.id)
    return (
        <div  className="column-view">
            <ColumnNameInput
                column={column}
            />
            <ValuesList
                id={column.id}
                values={column.values}
            />
            <AddValueInput id={column.id} />
        </div>
    );
}

Columns.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        values: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired
};

export default Columns;
