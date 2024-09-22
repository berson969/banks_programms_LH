import  {useState} from 'react';
import AddButton from "../AddButton.jsx";
import { updateColumnNameAsync, deleteColumnAsync } from "../../thunks/index.js";
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";

function ColumnNameInput({ column }) {
    const dispatch = useDispatch();
    const [name, setName] = useState(column.name);

    const handleSaveNameColumn = () => {
        if (name !== column.name) {
            const updateColumn = {
                ...column,
                name
            }

            dispatch(updateColumnNameAsync(updateColumn));
        }
    };

    const handleRemoveColumn = () => {
        dispatch(deleteColumnAsync(column.id));
    };
    return (
        <div className="column-input">
            <label htmlFor={`columnName-${column.id}`}>Column Name:</label>
            <input
                id={`columnName-${column.id}`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter column name"
            />
            <div>
                <AddButton onClick={handleSaveNameColumn} text="Save" />
                <AddButton onClick={handleRemoveColumn} text="Remove" />
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
