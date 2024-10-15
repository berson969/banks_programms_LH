import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import {useDispatch, useSelector} from "react-redux";

import {closeOpenPopup, selectOpenPopup} from "../../../slices";
import {useEffect, useRef} from "react";


function OptionsPopup({ rowId, option, selectedOptions, onChange }) {
    const dispatch = useDispatch();
    const openPopup = useSelector(selectOpenPopup);
    const inputRef = useRef(null);
    // console.log("data", option, selectedOptions);

    const collectTuple = [rowId, option.columnId];

    useEffect(() => {

        if (openPopup[collectTuple] && inputRef.current) {
            inputRef.current.focus();
        }
    }, [openPopup, selectedOptions]);

    // Нажатие на любое место кроме input
    useEffect(() => {
        const handleClickOutside = (e) => {
            e.preventDefault();
            if (inputRef.current && !inputRef.current.parentNode.contains(e.target)) {
                dispatch(closeOpenPopup());
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openPopup, collectTuple]);


    const handleClick = (e) => {
        e.stopPropagation();
        console.log("Div clicked"); // Проверка клика по div
        onChange(e, option); // Вызываем onChange при клике на div
    };

    return (
        <div
            className={`${styles.option} ${selectedOptions.find(opt => opt.id === option.id) ? styles.selected_option : ''}`}
            onClick={handleClick}
        >
            <input
                id={`option-${option.id}`}
                type="text"
                value={option.value}
                readOnly
                required
                onClick={handleClick}
            />
        </div>
    )
}

OptionsPopup.propTypes = {
    rowId: PropTypes.string.isRequired,
    option: PropTypes.shape({
        id: PropTypes.string.isRequired,
        columnId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        addition: PropTypes.array
    }).isRequired,
    selectedOptions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        columnId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        addition: PropTypes.array,
    })).isRequired,
    onChange: PropTypes.func.isRequired,
}


export default OptionsPopup;
