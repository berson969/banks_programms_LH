import  {useState} from 'react';
import { useSelector} from "react-redux";
import {selectColumns, selectStatus} from "../slices";
import FiltersDropdown from "./FiltersDropdown";


function TableHeader() {
    const columns = useSelector(selectColumns);
    const status = useSelector(selectStatus);
    const [visibleFilter, setVisibleFilter] = useState(null);

    const handleColumnClick = (columnId) => {
        setVisibleFilter(visibleFilter === columnId ? null : columnId);
    };

    if (status === 'loading') {
        return <thead><tr><th>Loading...</th></tr></thead>
    }
    // console.log("columns-TableHeader", columns)
    return (
        <thead>
            <tr>
            {columns.map(column => (
                <th key={column.id}
                    className="title"
                    onClick={() => handleColumnClick(column.id)}
                >
                    {column.name}
                    {visibleFilter === column.id && (
                        <FiltersDropdown column={column} />
                    )}
                </th>
            ))}
            </tr>
        </thead>
    );
}

export default TableHeader;
