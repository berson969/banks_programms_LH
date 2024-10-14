import {useEffect, useState} from 'react';
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
    const collectTuple = [row.id, column.id];

    // выбор selectedOptions
    useEffect(() => {
        const newOptions = column.Values.map(values => values);
        setOptions(newOptions);

        const selectedValues = row.cellValues
            .filter(cell => cell.columnId === column.id && cell.Value)
            .map(cell =>  cell.Value);
        setSelectedOptions(selectedValues);
    }, [row.cellValues, column]);

    // нажатие на правую кнопку мыши
    // useEffect(() => {
    //     const handleRightClick = (e) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         if (e.target.closest('td')) {
    //             dispatch(setOpenPopup({ [tuplePosition]: true }));
    //             console.log("Popup opened for:", tuplePosition);
    //         } else {
    //             dispatch(closeOpenPopup());
    //         }
    //         console.log("🖱 Right click detected!", openPopup, e.target.closest('td'));
    //     };
    //     document.addEventListener('contextmenu', handleRightClick);
    //     return () => {
    //         document.removeEventListener('contextmenu', handleRightClick);
    //     };
    // }, [dispatch, openPopup, tuplePosition]);

    const handleClick = (e) => {
        console.log("click", e.target.closest(`.${styles.cell}`));
        if (e.target.closest(`.${styles.cell}`)) {
            console.log('Clicked on ContentCell');
            dispatch(toggleOpenPopup(collectTuple));

        } else if (e.target.closest(`.${styles.options_list}`)) {
            console.log('Clicked inside options list - popup remains open');

        } else {
            console.log('Clicked outside - closing popup');
            dispatch(closeOpenPopup());
        }
        console.log("click after")
    };

    const handleChange = (e, option) => {
        console.log("clickSelectedOption-change", option);
        if (selectedOptions.map(setSelectedOption => setSelectedOption.value).includes(option.value)) {
            const updatedSelectedOptions = selectedOptions.filter(selectedOption => selectedOption.id !== option.id);
            setSelectedOptions(updatedSelectedOptions);
            console.log("updatedSelectedOption-change", updatedSelectedOptions);

            const cellValue = row.cellValues.find(cell => cell.valuesId === option.id);

            if (cellValue) {
                dispatch(removeValuesFromRowAsync(cellValue));
            }
        } else {
            setSelectedOptions([...selectedOptions, option]);

            const newValues = column.Values.find(value => value === option);

            if (newValues) {
                const updateData = { rowId: row.id, columnId: column.id, valuesId: newValues.id };
                dispatch(updateRowAsync(updateData));
                // collectTuple.push('cell')
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
                <div className={styles.options_list}>
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
