import {useDispatch, useSelector} from "react-redux";
import styles from './styles.module.scss';
import {closeOpenPopup, selectColumns, selectOpenPopup, selectStatus, setOpenPopup } from "../slices";
import FiltersDropdown from "./FiltersDropdown";
import SortingButton from "./SortingButton";


function TableHeader() {
    const dispatch = useDispatch();
    const columns = useSelector(selectColumns);
    const status = useSelector(selectStatus);
    const openPopup = useSelector(selectOpenPopup);

    const handleColumnClick = (e, columnId) => {
        e.preventDefault()
        if (openPopup.filter === columnId) {
            dispatch(closeOpenPopup());
        } else {
            dispatch(setOpenPopup({ filter: columnId}));
        }
    };

    if (status === 'loading') {
        return <thead><tr><th>Loading...</th></tr></thead>
    }
    return (
        <thead>
            <tr>
            {columns.map(column => (
                <th key={column.id}
                    className={styles.title}
                    onClick={(e) => handleColumnClick(e, column.id)}
                >
                    {column.name}
                    <SortingButton column={column} />
                    {openPopup.filter === column.id  && (
                        <FiltersDropdown column={column} />
                    )}
                </th>
            ))}
            </tr>
        </thead>
    );
}

export default TableHeader;
