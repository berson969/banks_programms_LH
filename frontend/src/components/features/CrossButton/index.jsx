import PropTypes from 'prop-types';
import styles from './styles.module.scss';

function CrossButton({ onRemoveValue, index }) {
    return <button
        onClick={(e) => onRemoveValue(e, index)}
        className={styles.cross_button}
    >
        ×
    </button>;
}

CrossButton.propTypes = {
    onRemoveValue: PropTypes.func.isRequired,
    index: PropTypes.string.isRequired
};

export default CrossButton;
