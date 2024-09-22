import PropTypes from "prop-types";

function AddButton({ onClick, text }) {
    return <button onClick={onClick}>{text}</button>;
}

AddButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
};

export default AddButton;
