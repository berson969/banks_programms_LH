import {useEffect, useRef, useState} from 'react';
import PropTypes from "prop-types";
import styles from './styles.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {closeOpenPopup, selectOpenPopup, selectUser, setOpenPopup, toggleOpenPopup} from "../../slices";
import {removeValuesFromRowAsync, updateRowAsync} from "../../thunks";
import ContentCell from "./ContentCell";
import OptionsPopup from "./OptionsPopup";


function RowCell ({ column, row }) {
    const dispatch = useDispatch();
    const openPopup = useSelector(selectOpenPopup);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([]);
    const { role } = useSelector(selectUser);
    const popupRef = useRef(null);
    const collectTuple = [row.id, column.id];

    // выбор selectedOptions
    useEffect(() => {
        const newOptions = column.Values.map(values => values);
        setOptions(newOptions);

        const selectedValues = row.cellValues
            .filter(cell => cell.columnId === column.id && cell.Value)
            .map(cell =>  cell.Value);
        setSelectedOptions(selectedValues);
        // console.log("selectedOptions change", options, selectedOptions);
    }, [row.cellValues, column]);

    // Обработчик события клика при монтировании компонента
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                dispatch(closeOpenPopup());
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClick = (e) => {
        console.log("click", e.target.closest(`.${styles.cell}`));
        if (e.target.closest(`.${styles.cell}`)) {
            dispatch(toggleOpenPopup(collectTuple));
        }
    };

    const handleChange = (e, option) => {
        // console.log("clickSelectedOption-change", option);
        const isSelected = selectedOptions.some(selectedOption => selectedOption.id === option.id);
        // console.log("isSelected", isSelected);
        if (isSelected) {
            const updatedSelectedOptions = selectedOptions.filter(selectedOption => selectedOption.id !== option.id);
            console.log("updatedSelectedOption-change", updatedSelectedOptions);

            const cellValue = row.cellValues.find(cell => cell.valuesId === option.id);

            if (cellValue) {
                dispatch(removeValuesFromRowAsync(cellValue));
            }
        } else {
            const newValues = column.Values.find(value => value === option);

            if (newValues) {
                const updateData = { rowId: row.id, columnId: column.id, valuesId: newValues.id };
                dispatch(updateRowAsync(updateData));
                dispatch(setOpenPopup({ [collectTuple]: true }));
            }
        }
    };
    // console.log("openPopup", openPopup );
    return (
        <td className={styles.cell} onClick={handleClick} >
            <div>
                <ContentCell selectedOptions={selectedOptions} collectTuple={collectTuple} />
            </div>
            {role === "admin" && openPopup[[ row.id, column.id ]] &&
                <div className={styles.options_list} ref={popupRef} >
                    {options.map(option =>
                        <div key={option.id}>
                            <OptionsPopup
                                rowId={row.id}
                                option={option}
                                selectedOptions={selectedOptions}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                </div>
            }
        </td>
    );
}

RowCell.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired,
        Values: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                columnId: PropTypes.string,
                value: PropTypes.string
            })
        ),
    }).isRequired,
    row: PropTypes.shape({
        id: PropTypes.string,
        cellValues: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                rowId: PropTypes.string.isRequired,
                columnId: PropTypes.string.isRequired,
                valuesId: PropTypes.string.isRequired,
                Value:PropTypes.shape({
                        id: PropTypes.string.isRequired,
                        columnId: PropTypes.string.isRequired,
                        value: PropTypes.string.isRequired
                    }
                )
            })
        ).isRequired,
    })
}

export default RowCell;
