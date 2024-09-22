import PropTypes from 'prop-types';

function CrossButton({ onRemoveValue, index }) {
    return <button
        onClick={(e) => onRemoveValue(e, index)}
        className="cross-button"
    >
        ×
    </button>;
}

CrossButton.propTypes = {
    onRemoveValue: PropTypes.func.isRequired,
    index: PropTypes.string.isRequired
};

export default CrossButton;
