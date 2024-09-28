
import { useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
import './App.css';

import {fetchColumns, fetchRows} from './thunks';
import {login, logout, selectColumns, selectError, selectStatus, selectUser, setLoading} from "./slices";

import Table from "./components/Table";
import Columns from "./components/columns/Columns";
import TableControls from "./components/TableControls";
import LoginForm from "./components/LoginForm";
import ClearFilters from "./components/ClearFilters";


function App() {
  const dispatch = useDispatch();
  const columns = useSelector(selectColumns);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const user = useSelector(selectUser);
  const { isAuthenticated, role } = user;

  const getUserFromLocalStorage = () => {
    const loginData = localStorage.getItem('loginData');
    if (loginData) {
      const { loginTime, role } = JSON.parse(loginData);
      if (loginTime) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - loginTime;

        if (elapsedTime > 24 * 60 * 60 * 1000) {
          dispatch(logout());
          localStorage.removeItem('loginData');
        } else {
          dispatch(login(role));
        }
      }
    }
  };

  useEffect(() => {
    dispatch(fetchColumns());
    dispatch(fetchRows());
    getUserFromLocalStorage();
    dispatch(setLoading('idle'));
  }, []);

  useEffect(() => {
    getUserFromLocalStorage();
  }, [dispatch]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  // console.log("column-app", columns)
  return (
      <div className="container">
        <h1>Banks Programs</h1>
        {!isAuthenticated && <LoginForm />}
        {isAuthenticated && role === "admin" &&
            <div className="column-views">
              {columns && columns.map((column) => (
                  <Columns
                      key={column.id}
                      column={column}
                  />
              ))}
            </div>}
        {isAuthenticated && role === "admin" && <TableControls />}
        {isAuthenticated && <ClearFilters />}
        {isAuthenticated  && columns && columns.length > 0 && <Table columns={columns} />}
      </div>
  )
}

export default App;
