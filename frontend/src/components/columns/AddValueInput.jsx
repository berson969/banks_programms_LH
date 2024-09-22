import { useState } from 'react';
import {useDispatch} from "react-redux";
import {updateValueToColumnAsync} from "../../thunks";
import PropTypes from "prop-types";

function AddValueInput ({ id }) {
    const dispatch = useDispatch();
    const [newValue, setNewValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('newValue', newValue)
        if (newValue.trim()) {
            dispatch(updateValueToColumnAsync(
                id,
                newValue.trim()
            ))
            setNewValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                id={`value-${id}`}
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Enter new value"
            />
            <button type="submit">Add Value</button>
        </form>
    );
}

AddValueInput.propTypes = {
    id: PropTypes.string.isRequired,
};

export default AddValueInput;
