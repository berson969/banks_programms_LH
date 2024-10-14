import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import {useDispatch} from "react-redux";
import {setOpenPopup} from "../../../../slices";

function RrrUserCell({ values }) {
    const dispatch = useDispatch();

    const handleClick = (e) => {
        e.preventDefault();
        dispatch(setOpenPopup(values.id));
    };

    return (
        <div>
            {values.addition.length > 0
                ? <div className={styles.user_cell__content}
                    onClick={handleClick}
                >{values.value}</div>
                : <div>{values.value}</div>
            }
        </div>
    );
}

RrrUserCell.propTypes = {
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

export default RrrUserCell;
