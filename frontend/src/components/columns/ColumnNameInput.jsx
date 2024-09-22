import  {useState} from 'react';
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import { updateColumnAsync, deleteColumnAsync } from "../../thunks";
import AddButton from "../AddButton";


function ColumnNameInput({ column }) {
    const dispatch = useDispatch();
    const [name, setName] = useState(column.name);

    const handleSaveNameColumn = (e) => {
        e.preventDefault();
        if (name !== column.name) {
            const updateColumn = {
                ...column,
                name
            }

            dispatch(updateColumnAsync(updateColumn));
        }
    };

    const handleRemoveColumn = (e) => {
        e.preventDefault();
        dispatch(deleteColumnAsync(column.id));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSaveNameColumn(e);
        }
    };

    return (
        <div className="column-input">
            <label htmlFor={`columnName-${column.id}`} >Column Name:</label>
            <input
                id={`columnName-${column.id}`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                placeholder="Enter column name"
            />
            <div>
                <AddButton onClick={(e) => handleSaveNameColumn(e)} text="Save" />
                <AddButton onClick={(e) => handleRemoveColumn(e)} text="Remove" />
            </div>
        </div>
    );
}

ColumnNameInput.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired, // ID колонки
        name: PropTypes.string.isRequired, // Имя колонки
        values: PropTypes.arrayOf(PropTypes.string).isRequired, // Значения колонки
        createdAt: PropTypes.string, // Дата создания
    }).isRequired
};

export default ColumnNameInput;
