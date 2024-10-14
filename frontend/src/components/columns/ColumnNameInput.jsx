import  {useState} from 'react';
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import {useDispatch} from "react-redux";
import { updateColumnAsync, deleteColumnAsync } from "../../thunks";
import AddButton from "../AddButton";
import Input from "../features/Input/index.jsx";


function ColumnNameInput({ column }) {
    const dispatch = useDispatch();
    const [name, setName] = useState(column.name);

    const handleUpdateNameColumn = (e) => {
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
            handleUpdateNameColumn(e);
        }
    };

    return (
        <div className={styles.column_input}>
            <div>Column Name:</div>
            <Input
                id={`col-name-${column.id}`}
                value={name}
                description="name"
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                isEditing={true}
            />
            <div className={styles.buttons}>
                <AddButton onClick={(e) => handleUpdateNameColumn(e)} text="Save" />
                <AddButton onClick={(e) => handleRemoveColumn(e)} text="Remove" />
            </div>
        </div>
    );
}

ColumnNameInput.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired, // ID колонки
        name: PropTypes.string, // Имя колонки
        Values: PropTypes.arrayOf(
            PropTypes.shape({
            id: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            columnId: PropTypes.string.isRequired
        })), // Значения колонки
        createdAt: PropTypes.string, // Дата создания
    }).isRequired
};

export default ColumnNameInput;
