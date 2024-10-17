import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import styles from "./styles.module.scss";
import {closeOpenPopup, selectOpenPopup, setOpenPopup} from "../../../slices";

import AdditionPopup from "../../columns/Values/AdditionPopup";


function CellInput({ values, collectTuple }) {
    const dispatch = useDispatch();
    const openPopup = useSelector(selectOpenPopup);

    const handleOpenAdditionPopup = (e) => {
        e.stopPropagation()
        openPopup[[collectTuple, values.id]] === true
            ? dispatch(closeOpenPopup())
            : dispatch(setOpenPopup({ [[...collectTuple, values.id]]: true }));
    };

    return (
        <div className={styles.cell_content} >
            {values.addition.length > 0
                ?
                    <>
                        <div className={styles.value} onClick={handleOpenAdditionPopup}>
                             {values.value}
                        </div>
                        {openPopup[[...collectTuple, values.id]] && <AdditionPopup valuesId={values.id} />}
                    </>
                    : <div>
                        {values.value}
                      </div>
            }
        </div>
    );
}

CellInput.propTypes = {
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
    collectTuple: PropTypes.array,
    selectedOption: PropTypes.shape({
        id: PropTypes.string,
        columnId: PropTypes.string,
        createdAt: PropTypes.string,
        value: PropTypes.string,
        addition: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                typeValue: PropTypes.string,
                additionId: PropTypes.string,
            }),
        )
    })
};

export default CellInput;
