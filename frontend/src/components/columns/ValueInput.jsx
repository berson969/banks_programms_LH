import { useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {updateValueToColumnAsync} from "../../thunks";
import PropTypes from "prop-types";
import EditButton from "./EditButton";


function ValueInput({ values }) {
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const [valueInput, setValueInput] = useState(values.value);
    const [isEditing, setIsEditing] = useState(false);

    const handleChangeValue = (newValue) => {
        setValueInput(newValue.trim());
    };

    const handleEditValue = (e) => {
        e.preventDefault();
        if (isEditing) {
            console.log("value changed", values);
            const valueData = {
                id: values.id,
                value: valueInput
            }
            dispatch(updateValueToColumnAsync(valueData));
        }
        setIsEditing(!isEditing);
        console.log("inputRef-ValInput", inputRef.current);
        if (inputRef.current && !isEditing) {
            inputRef.current.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEditValue(e);
            if (inputRef.current) {
                inputRef.current.focus();
            }
            // setIsEditing(false);
        }
    }
    // console.log("values", values, values.id)
    return (
        <div className="value-input">
            <input
                id={values.id}
                type="text"
                value={valueInput}
                onChange={(e) => handleChangeValue(e.target.value)}
                placeholder="Enter value"
                disabled={!isEditing}
                onKeyDown={handleKeyDown}
                autoFocus={isEditing}
                ref={inputRef}

            />
            <EditButton onEditValue={handleEditValue} />
        </div>
    );
}

ValueInput.propTypes = {
    values: PropTypes.shape({
            id: PropTypes.string.isRequired,
            columnId: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        }).isRequired
};

export default ValueInput;
