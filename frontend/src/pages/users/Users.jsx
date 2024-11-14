import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import UserCard from './UserCard';
import Button from '@mui/joy/Button';
import Add from '@mui/icons-material/Add';
import SearchBar from './SearchBar';
import Modal from '@mui/joy/Modal';
import Grow from '@mui/material/Grow';
import Box from '@mui/joy/Box';
import UserForm from './UserForm';
import config from '../../config';
import { green } from '@mui/material/colors';
import { useSnackbar } from '../../hooks/SnackBarProvider';
import { fetchUsers, resetEditUserId, resetDeleteUserId } from '../../store/userSlice';
import { setCurrentPage } from '../../store/authSlice';
import axios from 'axios';
import Loading1 from '../../common/Loading1';
import NoData from '../../common/NoData';
import Error from '../../common/Error';


const Users = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.auth.userInfo);
    const userRole = userInfo?.role || 'user';
    const isAdmin = userRole === 'admin';
    const usersState = useSelector(state => state.user);
    const users = usersState.users;
    const loading = usersState.loading;
    const errors = usersState.error;
    const noData = usersState.noData;
    const editUserId = useSelector(state => state.user.editUserId);
    const deleteUserId = useSelector(state => state.user.deleteUserId);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const openSnackbar = useSnackbar();

    const handleOpen = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        dispatch(resetEditUserId());
    };

    const handleUserFormSubmit = async (formData, isEdited, id) => {
        handleClose();
        try {
            if (isEdited) {
                openSnackbar('Updating User details...');
                await axios.put(`${config.SERVER_BASE_ADDRESS}/user/${id}`, formData, { withCredentials: true })
                openSnackbar('User has been modified', 'success');
            } else {
                openSnackbar('Creating new User...');
                await axios.post(`${config.SERVER_BASE_ADDRESS}/user`, formData, { withCredentials: true });
                openSnackbar('User has been created', 'success');
            }
            dispatch(fetchUsers());
        } catch (err) {
            console.log(err);
            openSnackbar(err?.response?.data?.message || err.message, 'danger');
            if (err?.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const filterUsers = (query) => {
        const queryLower = query.toLowerCase();
        setFilteredUsers(users.filter(user => user.name.toLowerCase().includes(queryLower)));
    };

    const getUserById = (id) => {
        if (users && Array.isArray(users)) {
            let output = users.filter(user => user._id === id);
            if (output && Array.isArray(output)) return output[0]
        }
        return {}
    }

    useEffect(() => {
        if (Array.isArray(users) && !users.length && !errors && !noData) {
            dispatch(fetchUsers());
        }
    }, [dispatch, users, errors, noData]);

    useEffect(() => {
        if (editUserId) {
            setShowModal(true);
        }
    }, [editUserId]);

    useLayoutEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Users'))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        async function deleteUser(id) {
            dispatch(resetDeleteUserId());
            try {
                openSnackbar('Deleting User details...');
                await axios.delete(`${config.SERVER_BASE_ADDRESS}/user/${id}`, { withCredentials: true })
                openSnackbar('User has been deleted', 'success');
                dispatch(fetchUsers());
            } catch (err) {
                console.log(err);
                openSnackbar(err?.response?.data?.message || err.message, 'danger');
                if (err?.response?.status === 401) {
                    navigate('/login');
                }
            }
        }
        if (deleteUserId) {
            deleteUser(deleteUserId);
        }
        // eslint-disable-next-line
    }, [deleteUserId]);

    return (
        <div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
            }}>
                <SearchBar inputHandler={filterUsers} />
                <Button
                    startDecorator={<Add />}
                    sx={{
                        backgroundColor: 'var(--primary-color)',
                        '&:hover': {
                            backgroundColor: green['A700'],
                            boxShadow: '0 0 20px var(--primary-color)'
                        },
                        '&:active': {
                            backgroundColor: 'var(--primary-color)',
                            boxShadow: 'none'
                        }
                    }}
                    onClick={handleOpen}
                    disabled={!isAdmin}
                >
                    New User
                </Button>

                {/* User Form Modal */}
                <Modal
                    open={isAdmin && showModal}
                    onClose={handleClose}
                >
                    <Grow in={isAdmin && showModal}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) !important',
                            width: 890,
                            height: 690,
                        }}>
                            <UserForm handleUserFormSubmit={handleUserFormSubmit} edit={editUserId} editFormDetails={getUserById(editUserId)} />
                        </Box>
                    </Grow>
                </Modal>
            </div>
            {!loading && !errors && (<div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, minmax(230px, 1fr))',
                gap: '10px',
                justifyContent: 'center',
                alignItems: 'start'
            }}>
                {filteredUsers.map((user) => (
                    <UserCard
                        key={user._id}
                        id={user._id}
                        ProfileImage={user.profileImage}
                        name={user.name}
                        role={user?.role || 'user'}
                        phone={user.phone}
                        email={user.email}
                    />
                ))}
            </div>)}
            {loading && <div style={{ height: '60%' }}><Loading1 /></div>}
            {!loading && errors && <div style={{ width: '100%', height: '600px' }}><Error errors={errors} /></div>}
            {!loading && !errors && Array.isArray(filteredUsers) && !filteredUsers.length && <div style={{ width: '100%', height: '600px' }}><NoData /></div>}
        </div>
    );
};

export default Users;