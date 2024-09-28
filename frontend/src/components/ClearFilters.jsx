import {removeDataFromLocalStorage} from "../../localStorageService.js";
import {useDispatch} from "react-redux";
import {setFilters} from "../slices/index.js";

function ClearFilters() {
    const dispatch = useDispatch();

    const handleClearFilters = (e) => {
        e.preventDefault()
        removeDataFromLocalStorage('filters');
        dispatch(setFilters([]));
    }

    return (
        <a
            className="clear-filters"
            onClick={handleClearFilters}
        >
            Clear all filters
        </a>
    );
}

export default ClearFilters;
