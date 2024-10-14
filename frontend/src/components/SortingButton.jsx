import PropTypes from "prop-types";
import styles from './styles.module.scss';
import {useDispatch, useSelector} from "react-redux";

import {closeOpenPopup, selectSorting, setSorting} from "../slices";


function SortingButton({ column }) {
    const dispatch = useDispatch();
    const sorting = useSelector(selectSorting);

    const handleColumnClick = (e) => {
        e.stopPropagation();
        dispatch(closeOpenPopup());
        if (sorting[column.id] !== undefined) {
            dispatch(setSorting({ [column.id]: !sorting[column.id] }));
        } else {
            dispatch(setSorting({ [column.id]: true }));
        }
    };

    // console.log("sorting", sorting);
    return (
        <button
            onClick={(e) => handleColumnClick(e, column.id)}
            className={`${styles.sorting_button} ${sorting[column.id] !== undefined ? styles.sorting_button__active : ''}`}
        >
            {sorting[column.id] ? '↑' : '↓'}
        </button>
    );
}

SortingButton.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired,
        Values: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                columnId: PropTypes.string,
                value: PropTypes.string
            })
        )
    }).isRequired,
}


export default SortingButton;
