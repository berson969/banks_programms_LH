import React from "react";
import PropTypes from 'prop-types';

import ValueInput from "./ValueInput";
import AddValueInput from "./AddValueInput";


const  ValuesList = React.memo( ({ column }) => {
    return (
        <ul>
            {column.Values && column.Values.map(values => (
                <li key={values.id}>
                    <ValueInput
                        values={values}
                        collectTuple={[values.id]}
                        ind="column"/>
                </li>
            ))}
            <li key={`new-${column.id}`} >
                <AddValueInput column={column}/>
            </li>
        </ul>
    );
});

ValuesList.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        Values: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                columnId: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired
            })
        )
    })
};

ValuesList.displayName = "ValuesList";
export default ValuesList;
