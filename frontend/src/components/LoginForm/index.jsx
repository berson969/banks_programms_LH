import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {login, logout, setError, setLoading} from '../../slices';
import {checkPassword} from "../../api";
import {
    getDataFromLocalStorage,
    removeDataFromLocalStorage,
    saveDataToLocalStorage
} from "../../../hooks/localStorageService";

function LoginForm () {
    const dispatch = useDispatch();
    const status = useSelector(state => state.table.status);
    const [password, setPassword] = useState('');

    useEffect(() => {
        const loginData = getDataFromLocalStorage('loginData');
        if (loginData) {
            const { loginTime, role } = loginData;
            if (loginTime) {
                const currentTime = Date.now();
                const elapsedTime = currentTime - loginTime;

                if (elapsedTime > 6 * 1000) {
                    dispatch(logout());
                    removeDataFromLocalStorage('loginTime');
                } else {
                    dispatch(login(role));
                }
            }
        }
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await checkPassword({ password });
            console.log("role", response.role)
            if (response.role) {

                const loginData = {
                    loginTime: Date.now(),
                    role: response.role
                };
                dispatch(login(response.role));
                saveDataToLocalStorage('loginData', loginData);
            } else {
                dispatch(setLoading('unauthorized'));
            }
        }  catch (error) {
            dispatch(setLoading('error'));
            console.error('Failed authorization:', error);
            dispatch(setError(error.toString()));
        }
       }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    id="login"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                />
                <button type="submit">Login</button>
            </form>
            {status === 'unauthorized' &&  <div>Error: Failed authorization</div>}
        </>

);
}

export default LoginForm;
