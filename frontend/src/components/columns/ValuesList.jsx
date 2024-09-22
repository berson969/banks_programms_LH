import PropTypes from 'prop-types';
import {useDispatch} from "react-redux";
import { removeValueFromColumnAsync } from "../../thunks";

import ValueInput from "./ValueInput";
import CrossButton from "../CrossButton";


function ValuesList({ id, values }) {
    const dispatch = useDispatch();

    const handleRemoveValue = (e, valueToRemove) => {
        e.preventDefault()
        console.log('removeValue', valueToRemove, id)
        dispatch(removeValueFromColumnAsync(
            id,
            valueToRemove
        ));
    }

    return (
        <ul>
            {values && values.map((value, index) => (
                <li key={index}>
                    <ValueInput id={id} value={value}  />
                    <CrossButton onRemoveValue={(e) => handleRemoveValue(e, value)} index={index.toString()} />
                </li>
            ))}
        </ul>
    );
}

ValuesList.propTypes = {
    id: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string)
};

export default ValuesList;
