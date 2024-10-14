import {useEffect, useRef} from 'react';
import PropTypes from "prop-types";
import styles from './styles.module.scss';


function Input({ id, value, description, onChange, onKeyDown, isEditing }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    return (
        <input
            id={id}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={`Enter new ${description}`}
            disabled={!isEditing}
            onKeyDown={onKeyDown}
            autoFocus={isEditing}
            ref={inputRef}
            className={styles.input}
        />

    );
}

Input.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isEditing: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
}.isRequired

export default Input;
