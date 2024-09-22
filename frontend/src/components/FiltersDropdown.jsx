import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectFilters, setFilters} from "../slices";


function FiltersDropdown({ column }) {
    const dispatch = useDispatch();
    const filters = useSelector(selectFilters);
    const [isPopupOpen, setIsPopupOpen] = useState(true);

    const handleCheckboxChange = (value) => {

            const currentFilters = filters[column.id] || [];
            const updatedValues = currentFilters.includes(value)
                ? currentFilters.filter(v => v !== value)
                : [...currentFilters, value];
            dispatch(setFilters({
                ...filters,
                [column.id]: updatedValues,
            }));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isPopupOpen && !event.target.closest('.popup')) {
                setIsPopupOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopupOpen]);

    const handlePopupClick = (event) => {
        event.stopPropagation();
    };

    const checkedControl = (value) =>  {
        return Object.keys(filters).includes(column.id)
            ? filters[column.id].includes(value)
            : false;
    };


    return (
        <div className="table-header">
            {
                isPopupOpen && (
                <div className="popup" onClick={handlePopupClick}>
                    <div>
                        {column.values.map((value, index) => (
                            <div key={index}>
                                <label
                                    htmlFor={`checkbox-${index}`}
                                    className="label-filter-input"
                                >
                                    <input
                                        id={`checkbox-${index}`}
                                        type="checkbox"
                                        value={value}
                                        checked={checkedControl(value)}
                                        onChange={() => handleCheckboxChange(value)}
                                    />
                                    {value}
                                </label>
                            </div>
                        ))}
                        {/*<button onClick={handleApplyFilter}>Apply Filter</button>*/}
                    </div>
                </div>
            )
            }
        </div>
    );
}

FiltersDropdown.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        values: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};

export default FiltersDropdown;
