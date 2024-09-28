import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectFilters, setFilters} from "../slices";
import {saveDataToLocalStorage} from "../../localStorageService";


function FiltersDropdown({ column }) {
    const dispatch = useDispatch();
    const filters = useSelector(selectFilters);
    const [isPopupOpen, setIsPopupOpen] = useState(true);

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

    const handleCheckboxChange = (value) => {

        const currentFilters = filters[column.id] || [];
        const updatedValues = currentFilters.includes(value)
            ? currentFilters.filter(v => v !== value)
            : [...currentFilters, value];
        dispatch(setFilters({
            ...filters,
            [column.id]: updatedValues,
        }));
        saveDataToLocalStorage('filters', {
            ...filters,
            [column.id]: updatedValues,
        });
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
                    {column.Values.map(values => (
                        <div key={values.id} className="filter-list">
                            <label
                                htmlFor={values.id}
                                className="label-filter"
                            >
                                <input
                                    id={values.id}
                                    type="checkbox"
                                    value={values.value}
                                    checked={checkedControl(values.value)}
                                    onChange={() => handleCheckboxChange(values.value)}
                                    className="filter-checkbox"
                                />
                                {values.value}
                            </label>
                        </div>
                    ))}
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
        Values: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                columnId: PropTypes.string,
                value: PropTypes.string
            })
        ).isRequired,
    }).isRequired,
};

export default FiltersDropdown;
