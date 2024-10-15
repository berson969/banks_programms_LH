import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import ValueInput from "../../columns/Values/ValueInput";


function ContentCell ({ selectedOptions, collectTuple }) {
    // console.log("selectedOptions-contenCell", selectedOptions);
    return (
        <>
            {selectedOptions.length > 0  && selectedOptions.map(selectedOption => (
                <div  key={`cell-content-${selectedOption.id}`} className={styles.cell_value}>
                    {selectedOption.addition.length > 0
                        ?   <ValueInput
                                values={selectedOption}
                                collectTuple={collectTuple}
                                ind="cell"
                        />
                        :   <div className={styles.cell_content}>
                            {selectedOption.value}
                        </div>
                    }
                </div>
            ))}
        </>
    );
}

ContentCell.propTypes = {
    selectedOptions: PropTypes.arrayOf(
        PropTypes.shape({
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
    ),
    collectTuple: PropTypes.array.isRequired
}

export default ContentCell;
