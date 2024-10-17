import styles from './styles.module.scss';
import {useDispatch} from "react-redux";

import {removeDataFromLocalStorage} from "../../hooks/localStorageService.js";
import {setFilters} from "../slices";

function ClearFilters() {
    const dispatch = useDispatch();

    const handleClearFilters = (e) => {
        e.preventDefault()
        removeDataFromLocalStorage('filters');
        dispatch(setFilters([]));
    }

    return (
        <div className={styles.clear_filters}>
            <a
                className={styles.clear_filters__content}
                onClick={handleClearFilters}
            >
                Clear all filters
            </a>
        </div>
    );
}

export default ClearFilters;
