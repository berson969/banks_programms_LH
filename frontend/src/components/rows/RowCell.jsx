import  {useState} from 'react';
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import {selectUser} from "../../slices/index.js";

function RowCell ({ column, value, onChange }) {
    const [currentValue, setCurrentValue] = useState(value || '');
    const { role } = useSelector(selectUser);

    const handleChange = (e) => {
        setCurrentValue(e.target.value);
        onChange(column.id, e.target.value);
    };

    return (
        <td>
            {role === "user" && <span className="value">{value}</span>}
            {role === "admin" &&
            <select
                // id={`header-${}`}
                value={currentValue}
                onChange={handleChange}
            >
            <option value=""></option>
            {column.values.map((optionValue, index) => (
                    <option
                        key={index}
                        value={optionValue}>
                            {optionValue}
                    </option>
                ))}
            </select>
            }
        </td>
    );
};

RowCell.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired,
        values: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
}

export default RowCell;
