import PropTypes from 'prop-types';
import styles from "./styles.module.scss";

function EditButton({ onEditValue, sign }) {
    return <button
        onClick={onEditValue}
        className={styles.edit_button}
    >
        {sign}
    </button>;
}

EditButton.propTypes = {
    onEditValue: PropTypes.func.isRequired,
    sign: PropTypes.string.isRequired
};

export default EditButton;
