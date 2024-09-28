import {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import 'react-dropdown/style.css';
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../../slices";
import {removeValuesFromRowAsync, updateRowAsync} from "../../thunks";

function RowCell ({ column, row }) {
    const dispatch = useDispatch();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { role } = useSelector(selectUser);

    useEffect(() => {
        const newOptions = column.Values.map(values => values.value);
        setOptions(newOptions);

        const selectedValues = row.cellValues
            .filter(cell => cell.columnId === column.id && cell.Value)
            .map(cell =>  cell.Value.value);

        setSelectedOptions(selectedValues);
    }, [row.cellValues, column]);

    const handleChange = (e, option) => {
        e.preventDefault();
        e.stopPropagation();

        if (selectedOptions.includes(option)) {
            const updatedSelectedOptions = selectedOptions.filter(value => value !== option);
            setSelectedOptions(updatedSelectedOptions);

            const cellValue = row.cellValues.find(cell => cell.Value.value === option);

            if (cellValue) {
                dispatch(removeValuesFromRowAsync(cellValue));
            }
        } else {
            setSelectedOptions([...selectedOptions, option]);

            const newValues = column.Values.find(value => value.value === option);
            if (newValues) {
                const updateData = { rowId: row.id, columnId: column.id, valuesId: newValues.id };
                dispatch(updateRowAsync(updateData));
            }
        }
    };


    return (
        <td onClick={() => setIsOpen(!isOpen)}>
            <span
                className="value"
            >
                {selectedOptions.join('  *//*  ')}
            </span>

            {role === "admin" && isOpen &&
            <div className="options-list">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`option ${selectedOptions.includes(option) ? "selected-option" : ""}`}
                        onClick={(e) => handleChange(e, option)}
                    >
                        {option}
                    </div>))
                }
            </div>
            }
        </td>
    );
}

RowCell.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired,
        Values: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                columnId: PropTypes.string,
                value: PropTypes.string
            })
        ).isRequired,
    }).isRequired,
    row: PropTypes.shape({
        id: PropTypes.string,
        cellValues: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                rowId: PropTypes.string.isRequired,
                columnId: PropTypes.string.isRequired,
                valuesId: PropTypes.string.isRequired,
                Value:PropTypes.shape({
                        id: PropTypes.string.isRequired,
                        columnId: PropTypes.string.isRequired,
                        value: PropTypes.string.isRequired
                    }
                )
            })
        ).isRequired,
    })
}

export default RowCell;
