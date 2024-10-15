import PropTypes from "prop-types";
import {useState} from 'react';
import {useDispatch} from "react-redux";
import {addValueToColumnAsync} from "../../../thunks";
import Input from "../../features/Input";


function AddValueInput ({ column }) {
    const dispatch = useDispatch();
    const [newValue, setNewValue] = useState('');

    const handleSubmit = (e) => {
        if (newValue.trim()) {
            const unique = column.Values.find(values => values.value === newValue.trim());
            if (!unique) {
                dispatch(addValueToColumnAsync(
                    column.id,
                    newValue.trim()
                ))
                setNewValue('');
            } else {
                console.log("unique-cancel", unique)
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    // console.log("AddValueInput ",  id)
    return (
        <form
            id={`form-${column.id}--${newValue}`}
            onSubmit={handleSubmit}
            >
            <Input
                id={`new-value-${column.id}-${newValue}`}
                value={newValue}
                description="value"
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={handleKeyDown}
                isEditing={true}
                />
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
