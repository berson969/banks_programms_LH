import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import "../index.css";
import {selectFilters, selectRows, setFilters} from "../slices";

import TableHeader from './TableHeader';
import Row from "./rows/Row";
import {getDataFromLocalStorage} from "../../localStorageService";


function Table() {
    const dispatch = useDispatch();
    const rows = useSelector(selectRows);
    const filters = useSelector(selectFilters);
    const [filteredRows, setFilteredRows] = useState(rows);

    useEffect(() => {
        const savedFilters = getDataFromLocalStorage('filters');
        if (savedFilters) {
            dispatch(setFilters(savedFilters));
        }
    }, [dispatch]);

    useEffect(() => {
        console.log("filters", filters)
        console.log("rows", rows)

        const newFilteredRows = Object.keys(filters).length > 0
            ? rows.filter(row =>
                Object.keys(filters).every(columnId => {
                    const columnFilters = filters[columnId] || [];

                    if (columnFilters.length === 0) return true;
                    if (row.cellValues.length === 0) return true;
                    return row.cellValues.some(cell => {
                            return cell.columnId === columnId &&
                            columnFilters.includes(cell.Value.value);
                        }
                    );
                })
            )
            : rows;

        setFilteredRows(newFilteredRows)
    }, [filters, rows])


    console.log("tableRows", filteredRows)
    return (
        <table>
            <TableHeader />
            <tbody>
                {filteredRows.map(row =>
                    <Row key={row.id} row={row} />
                )}
            </tbody>
        </table>
    );
}

export default Table;
