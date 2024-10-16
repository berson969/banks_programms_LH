import PropTypes from "prop-types";
import styles from './styles.module.scss';
import {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {closeOpenPopup, selectFilters, selectOpenPopup, setFilters, setOpenPopup} from "../slices";
import {saveDataToLocalStorage} from "../../hooks/localStorageService.js";


function FiltersDropdown({ column }) {
    const dispatch = useDispatch();
    const filterRef = useRef(null);
    const filters = useSelector(selectFilters);
    const openPopup = useSelector(selectOpenPopup);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (openPopup['filter'] && filterRef.current && !filterRef.current.contains(e.target)) {
                dispatch(closeOpenPopup());
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openPopup, dispatch]);

    const handlePopupClick = (e) => {
        e.stopPropagation();
        dispatch(closeOpenPopup());
    };

    const handleCheckboxChange = (value) => {

        const currentFilters = filters[column.id] || [];
        const updatedValues = currentFilters.includes(value)
            ? currentFilters.filter(v => v !== value)
            : [...currentFilters, value];
        // console.log("updatedValues-filters", updatedValues);
        dispatch(setFilters({
            ...filters,
            [column.id]: updatedValues,
        }));
        saveDataToLocalStorage('filters', {
            ...filters,
            [column.id]: updatedValues,
        });
        dispatch(setOpenPopup({ ['filter']: column.id }));
    };

    const checkedControl = (value) =>  {
        return Object.keys(filters).includes(column.id)
            ? filters[column.id].includes(value)
            : false;
    };


    return (
        <div className={styles.table_header}>
            {
                openPopup['filter'] && (
                <div className={styles.popup} onClick={handlePopupClick} ref={filterRef}>
                    {column.Values.map(values => (
                        <div key={values.id} className={styles.filter_list}>
                            <label
                                htmlFor={values.id}
                                className={styles.label_filter}
                            >
                                <input
                                    id={values.id}
                                    type="checkbox"
                                    value={values.value}
                                    checked={checkedControl(values.value)}
                                    onChange={() => handleCheckboxChange(values.value)}
                                    className={styles.filter_checkbox}
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
