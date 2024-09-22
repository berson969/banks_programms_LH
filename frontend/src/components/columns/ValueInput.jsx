import { v4 as uuidv4 } from 'uuid';
import {useDispatch} from "react-redux";
import {updateValueInColumn} from "../../slices";
import PropTypes from "prop-types";

function ValueInput({ id, value }) {
    const dispatch = useDispatch();

    const handleChangeValue = (e) => {
        const newValue = e.target.value.trim();
        if (newValue) {
            dispatch(updateValueInColumn({
                id,
                oldValue: value,
                newValue
            }));
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
            />
        </div>
    );
}

ValueInput.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
};

export default ValueInput;
