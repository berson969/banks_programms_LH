import { useDispatch } from 'react-redux';
import { addColumnAsync, addRowAsync } from '../thunks';
import AddButton from "./AddButton";

const TableControls = () => {
    const dispatch = useDispatch();

    const handleAddColumn = (e) => {
        e.preventDefault()
        dispatch(addColumnAsync());
    };

    const handleAddRow = (e) => {
        e.preventDefault()
        dispatch(addRowAsync());
    };

    return (
        <div className="table-controls">
            <AddButton onClick={handleAddColumn} text="Add Column" />
            <AddButton onClick={handleAddRow} text="Add Row" />
        </div>
    );
};

export default TableControls;
