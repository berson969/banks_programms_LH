import {useDispatch, useSelector} from 'react-redux';
import styles from './styles.module.scss';
import { addColumnAsync, addRowAsync } from '../thunks';
import AddButton from "./AddButton";
import {selectSortedRows, selectUser} from "../slices/index.js";

const TableControls = () => {
    const dispatch = useDispatch();
    const { role } = useSelector(selectUser);
    const sortedRows = useSelector(selectSortedRows);

    const handleAddColumn = (e) => {
        e.preventDefault()
        dispatch(addColumnAsync());
    };

    const handleAddRow = (e) => {
        e.preventDefault()
        dispatch(addRowAsync());
    };

    const handleSendEmail = (e) => {
        e.preventDefault();
        console.log("sortedRows", sortedRows);
        const emailAddresses = sortedRows.flatMap(row =>
            row.cellValues.flatMap(cell => cell.Value.addition
                .filter(addition => addition.typeValue === 'email') // Замените 'email' на фактический columnId для email
                .map(addition => addition.additionValue)
            )
        );
        // Удаляем дубликаты и формируем строку
        const uniqueEmails = [...new Set(emailAddresses)];
        // Открываем почтовый клиент
        window.location.href = `mailto:?bcc=${uniqueEmails.join(',')}`;
    };

    return (
        <div className={styles.table_controls}>
            {role === 'admin' && <AddButton onClick={handleAddColumn} text="Add Column" />}
            {role === 'admin' && <AddButton onClick={handleAddRow} text="Add Row" />}
            <AddButton onClick={handleSendEmail} text="Send Email" />
        </div>
    );
};

export default TableControls;
