import PropTypes from 'prop-types';

function EditButton({ onEditValue }) {
    return <button
        onClick={onEditValue}
        className="edit-button"
    >
        √
    </button>;
}

EditButton.propTypes = {
    onEditValue: PropTypes.func.isRequired,
};

export default EditButton;
