import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from './hooks/SnackBarProvider';
import { login, logout } from './store/authSlice';
import { Box } from '@mui/joy';
import ErrorBoundary from './common/ErrorBoundary';
import Loading from './common/Loading';
import ServerError from './common/ServerError';
import axios from 'axios';
import config from './config';


const Layout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const openSnackbar = useSnackbar();
    let [loading, setLoading] = useState(true);
    let [errors, setErrors] = useState('');
    let isLoggedIn = useSelector(state => state?.auth?.loggedIn);


    useEffect(() => {
        let TRIES_LEFT = 5;
        async function isAuthenticated() {
            setLoading(true);
            try {
                let response = await axios.get(`${config.SERVER_BASE_ADDRESS}/api`, { withCredentials: true });
                dispatch(login(response?.data));
                setLoading(false);
                setErrors('');
            } catch (err) {
                console.log(err);
                TRIES_LEFT--;
                if (err?.response?.status === 401) {
                    setTimeout(() => {
                        openSnackbar('UnAuthorized User! Please SIGN IN', 'danger');
                    }, 2000);
                    setTimeout(() => {
                        dispatch(logout());
                        navigate('/login');
                    }, 3000);
                } else {
                    if (TRIES_LEFT) {
                        await isAuthenticated();
                    } else {
                        setLoading(false);
                        setErrors(err?.message);
                    }
                }
            }
        }
        if (!isLoggedIn) {
            isAuthenticated();
        }
        // eslint-disable-next-line
    }, [])
    return (
        <Box>
            {loading && <Loading />}
            {!loading && errors && <ServerError errors={errors} />}
            {!loading && !errors && <ErrorBoundary>
                <Outlet />
            </ErrorBoundary>}
        </Box>
    );
};

export default Layout;