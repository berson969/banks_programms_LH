import {useRef, useState} from 'react';
import {useDispatch} from "react-redux";
import {addValueToColumnAsync} from "../../thunks";
import PropTypes from "prop-types";


function AddValueInput ({ column }) {
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const [newValue, setNewValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newValue.trim()) {
            const unique = column.Values.find(values => values.value === newValue.trim());
            if (!unique) {
                dispatch(addValueToColumnAsync(
                    column.id,
                    newValue.trim()
                ))
                setNewValue('');
                console.log("inputRef-AddvalueInput", inputRef.current);
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            } else {
                console.log("unique-cancel", unique)
            }
        }
    };
    // console.log("AddValueInput ",  id)
    return (
        <form onSubmit={handleSubmit}>
            <input
                id={`value-${column.id}`}
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Enter new value"
                ref={inputRef}
            />
            <button type="submit">Add Value</button>
        </form>
    );
}

AddValueInput.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        Values: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                columnId: PropTypes.string,
                value: PropTypes.string
            })
        ).isRequired,
    })
};

export default AddValueInput;
