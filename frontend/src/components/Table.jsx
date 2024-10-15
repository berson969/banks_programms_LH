import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectFilters, selectRows, selectSortedRows, selectSorting, setFilters, setSortedRows} from "../slices";

import TableHeader from './TableHeader';
import Row from "./rows/Row";
import {getDataFromLocalStorage} from "../../hooks/localStorageService.js";


function Table() {
    const dispatch = useDispatch();
    const rows = useSelector(selectRows);
    const filters = useSelector(selectFilters);
    const sorting = useSelector(selectSorting);
    const sortedRows = useSelector(selectSortedRows);
    const [filteredRows, setFilteredRows] = useState(rows);

    // Эффект для загрузки фильтров из локального хранилища
    useEffect(() => {
        const savedFilters = getDataFromLocalStorage('filters');
        if (savedFilters) {
            setFilters(savedFilters);
        }
    }, [dispatch]);

    // Эффект для фильтрации строк
    useEffect(() => {
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
    }, [filters, rows]);

    // Эффект для сортировки строк
    useEffect(() => {
        const columnId = Object.keys(sorting).find(key => sorting[key]);
        if (!columnId) {
             dispatch(setSortedRows(filteredRows));
            return;
        }
        const newSortedRows = [...filteredRows].sort((a, b) => {

            const aValue = a.cellValues.find(cell => cell.columnId === columnId)?.Value.value || '';
            const bValue = b.cellValues.find(cell => cell.columnId === columnId)?.Value.value || '';

            // console.log("aValue", aValue, "*?*", bValue);
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sorting[columnId]
                    ? bValue.localeCompare(aValue) // Сортировка по убыванию
                    : aValue.localeCompare(bValue) // Сортировка по возрастанию
            }
            // Обработка чисел (предполагая, что значения могут быть числами)
            if (!isNaN(aValue) && !isNaN(bValue)) {
                return sorting[columnId] ? bValue - aValue : aValue - bValue;
            }
            return 0;
        });
        dispatch(setSortedRows(newSortedRows));
    }, [sorting, filteredRows]);

    // console.log("sorting-table", sorting);
    console.log("tableRows", sortedRows)
    return (
        <table>
            <TableHeader />
            <tbody>
                {sortedRows.map(row =>
                    <Row key={row.id} row={row} />
                )}
            </tbody>
        </table>
    );
}

export default Table;
