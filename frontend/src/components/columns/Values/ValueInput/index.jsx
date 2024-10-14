import React, {useEffect} from 'react';
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import { useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectOpenPopup} from "../../../../slices";
import {updateValueToColumnAsync} from "../../../../thunks";

import AdditionPopup from "../AdditionPopup";
import Buttons from "./Buttons";
import Input from "../../../features/Input";


const ValueInput = React.memo( ({ values, collectTuple, ind }) => {
    const dispatch = useDispatch();
    const openPopup = useSelector(selectOpenPopup);
    const inputRef = useRef(null);
    const [valueInput, setValueInput] = useState(values.value || '');
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleChangeValue = (e) => {
        const newValue = e.target.value.trim();
        setValueInput(newValue);
    };

    const handleEditValue = (e) => {
        e.preventDefault();
        e.stopPropagation()
        if (isEditing) {
            const valueData = {
                id: values.id,
                value: valueInput.trim()
            };
            dispatch(updateValueToColumnAsync(valueData));
        }
        setIsEditing(!isEditing);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleEditValue(e);
        } else {
            handleChangeValue(e)
        }
    };

    return (
        <div className={`${styles.input_values} ${ind === 'cell' ? styles.cell_border : ''}`}>
            <form key={`values-${values.id}`} onSubmit={handleEditValue}>
                <Input
                    id={values.id}
                    value={valueInput}
                    description="value"
                    onChange={(e) => setValueInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    isEditing={isEditing}
                    />
                <Buttons id={values.id} ind={ind} collectTuple={collectTuple}  onEditValue={handleEditValue} />
            </form>
            {openPopup[[...collectTuple, ind]] && <AdditionPopup values={values} />}
         </div>
    );
});

ValueInput.propTypes = {
    values: PropTypes.shape({
        id: PropTypes.string.isRequired,
        columnId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        addition: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                valuesId: PropTypes.string,
                additionValue: PropTypes.string,
                typeValue: PropTypes.string,
            })
        ),
    }).isRequired,
    collectTuple: PropTypes.array,
    ind: PropTypes.string.isRequired,
};

ValueInput.displayName = "ValueInput";
export default ValueInput;
