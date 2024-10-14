import styles from './styles.module.scss';
import {useState} from "react";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {selectUser, setOpenPopup} from "../../../../slices";
import {addAdditionAsync, deleteAdditionAsync} from "../../../../thunks";

import CrossButton from "../../../features/CrossButton";
import Input from "../../../features/Input";
import AdditionContent from "./AdditionContent";


function AdditionPopup({ values }) {
    const dispatch = useDispatch();
    const { role } = useSelector(selectUser);

    const [valueAddition, setValueAddition] = useState('');
    const [valueType, setValueType] = useState('text');
    const [error, setError] = useState('');

    const handleAdditionChange = (e) => {
        const addition = e.target.value.trim();
        setValueAddition(addition);
    };

    const handleTypeChange = (e) => {
        setValueType(e.target.value);
    };

    const checkType = (value) => {
        if (valueType === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                setError('Invalid email format');
                return false;
            }
        } else if (valueType === 'text') {
            const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
            if (!urlPattern.test(value)) {
                setError('Invalid URL format');
                return false;
            }
        }
        setError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (checkType(valueAddition)) {

            const isUnique = !values.addition.some(addition =>
                addition.additionValue === valueAddition && addition.typeValue === valueType
            );
            if (!isUnique) return setError('Put not unique value');
            const additionContent = {
                valuesId: values.id,
                additionValue: valueAddition,
                typeValue: valueType
            };
            dispatch(addAdditionAsync(additionContent));
            setValueAddition('');
            setValueType('text');
        };
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        } else {
            handleAdditionChange(e);
        }
    }

    const handleClose = (e) => {
        e.stopPropagation();
        dispatch(setOpenPopup(''));
    };

    const handleDeleteAddition = (e, id) => {
        e.preventDefault();
        dispatch(deleteAdditionAsync(id));
    }

    return (
        <div className={styles.popup} id={`additionPopup-${values.id}`}>
            <div className={styles.title}>{values.value}</div>
            <span className={styles.close} onClick={handleClose} >&times;</span>
            <div className={styles.popup_content}>

                <div>
                    {values.addition && values.addition.length > 0 && values.addition.map((addition) => (
                        <div key={`addition-${addition.id}`} className={styles.addition_item}>
                            <AdditionContent addition={addition} />
                            {role === "admin" &&
                                <CrossButton onRemoveValue={(e) => handleDeleteAddition(e, addition.id)}
                                         index={addition.id}/>
                            }
                        </div>
                    ))}
                </div>
                {role === "admin" && <form onSubmit={handleSubmit}>
                    <div className={styles.input_addition}>
                        <span>Type</span>
                        <select id="typeSelect" value={valueType} onChange={handleTypeChange}>
                            <option value="text">comment</option>
                            <option value="email">email</option>
                            <option value="url">link</option>
                        </select>
                    </div>
                    {error && <div className={styles.error}>{error}</div>}
                    <div>
                        <Input
                            id={`new-addition-${values.id}`}
                            value={valueAddition}
                            description="addition value"
                            onChange={(e) => setValueAddition(e.target.value)}
                            onKeyDown={handleKeyDown}
                            isEditing={true}
                        />
                    </div>
                </form>}
            </div>
        </div>
    );
}

AdditionPopup.propTypes = {
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
};

export default AdditionPopup;
