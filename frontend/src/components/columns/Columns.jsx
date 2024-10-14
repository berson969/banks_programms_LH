import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import ColumnNameInput from './ColumnNameInput';
import ValuesList from './Values/ValuesList';


function Columns({ column }) {
    return (
        <div  className={styles.column_view} >
            <ColumnNameInput
                id={`name-${column.id}`}
                column={column}
            />
            <ValuesList
                column={column}
            />
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
                value: PropTypes.string,
                addition: PropTypes.array
            })
        )
    }).isRequired
};

export default Columns;
