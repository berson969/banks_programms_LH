import styles from "./styles.module.scss";
import {closeOpenPopup, selectOpenPopup, setOpenPopup} from "../../../../slices";
import {removeValueFromColumnAsync} from "../../../../thunks";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from "prop-types";

import EditButton from "../../../features/EditButton";
import CrossButton from "../../../features/CrossButton";


function Buttons({ id, collectTuple, onEditValue }) {
    const dispatch = useDispatch();
    const openPopup = useSelector(selectOpenPopup);

    const handleRemoveValue = (e) => {
        e.preventDefault()
        dispatch(removeValueFromColumnAsync(id));
    };

    const handleAdditionDetail = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (openPopup[[...collectTuple, "column"]]) {
            dispatch(closeOpenPopup());
        } else {
            dispatch(setOpenPopup({ [[...collectTuple, "column"]]: true }));
        }

    };

    return (
        <div className={styles.buttons}>
            <EditButton
                onEditValue={onEditValue}
                sign="v"/>
            <CrossButton
                onRemoveValue={(e) => handleRemoveValue(e, id)}
                index={id}/>
            <EditButton
                onEditValue={handleAdditionDetail}
                sign="A"/>
        </div>
    );
}

Buttons.propTypes = {
    id: PropTypes.string.isRequired,
    collectTuple: PropTypes.array.isRequired,
    onEditValue: PropTypes.func.isRequired,
}

export default Buttons;
