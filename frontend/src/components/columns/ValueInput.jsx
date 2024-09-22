import { v4 as uuidv4 } from 'uuid';
import {useRef} from "react";
import {useDispatch} from "react-redux";
// import {updateValueInColumnAsync} from "../../thunks";
import PropTypes from "prop-types";


function ValueInput({ id, value }) {
    const dispatch = useDispatch();
    const inputRef = useRef(null);

    const handleChangeValue = (e) => {
        e.preventDefault();
        const newValue = e.target.value.trim();
        if (newValue) {
            dispatch(updateValueInColumnAsync({
                id,
                oldValue: value,
                newValue
            }));
        }
    };

    const handleFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };


    return (
        <div className="value-input">
            <input
                id={`columnValue-${uuidv4()}`}
                type="text"
                value={value}
                onChange={handleChangeValue}
                placeholder="Enter value"
                onFocus={handleFocus}
            />
        </div>
    );
}

ValueInput.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
};

export default ValueInput;
