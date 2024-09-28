import PropTypes from 'prop-types';
import {useDispatch} from "react-redux";
import {removeValueFromColumnAsync} from "../../thunks";

import ValueInput from "./ValueInput";
import CrossButton from "../CrossButton";


function ValuesList({ Values }) {
    const dispatch = useDispatch();

    const handleRemoveValue = (e, id) => {
        e.preventDefault()
        dispatch(removeValueFromColumnAsync(id));
    }
    // console.log('Values', Values)
    return (
        <ul>
            {Values && Values.map(values => (
                <li key={values.id}>
                    <ValueInput  values={values} />
                    <CrossButton onRemoveValue={(e) => handleRemoveValue(e, values.id)} index={values.id} />
                </li>
            ))}
        </ul>
    );
}

ValuesList.propTypes = {
    Values: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            columnId: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })
    )
};

export default ValuesList;
