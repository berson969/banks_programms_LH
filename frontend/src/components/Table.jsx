import {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import "../index.css";
import {selectFilters, selectRows} from "../slices";

import TableHeader from './TableHeader';
import Row from "./rows/Row";


function Table() {
    const rows = useSelector(selectRows);
    const filters = useSelector(selectFilters);
    const [filteredRows, setFilteredRows] = useState(rows);

    useEffect(() => {
        console.log("filters", filters)
        console.log("rows", rows)

        const newFilteredRows = Object.keys(filters).length > 0
            ? rows.filter(row =>
                Object.keys(filters).every(columnId => {
                    const columnFilters = filters[columnId] || [];

                    if (columnFilters.length === 0) return true;

                    return row.cellValues.some(cell => {
                        console.log("cell", cell.cellValue, columnFilters.includes(cell.cellValue))
                            return cell.columnId === columnId &&
                            columnFilters.includes(cell.cellValue)
                        }
                    );
                })
            )
            : rows;

        setFilteredRows(newFilteredRows)
        console.log("filteredRows", newFilteredRows)
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
