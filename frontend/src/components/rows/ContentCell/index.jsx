import PropTypes from "prop-types";
import CellInput from "./CellInput";


function ContentCell ({ selectedOptions, collectTuple }) {
    // console.log("selectedOptions-contenCell", selectedOptions);
    return (
        <>
            {selectedOptions.length > 0  && selectedOptions.map(selectedOption => (
                <CellInput
                    values={selectedOption}
                    collectTuple={collectTuple}
                    key={`cell-content-${selectedOption.id}`}
                />
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
