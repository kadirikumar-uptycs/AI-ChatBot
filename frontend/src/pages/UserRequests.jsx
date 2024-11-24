import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Chip,
    Button,
    CircularProgress,
    Container,
    Grid,
    Backdrop,
} from '@mui/material';
import { IconButton, Tooltip } from '@mui/joy';
import {
    CheckCircleOutline as ApprovedIcon,
    PendingOutlined as PendingIcon,
    CancelOutlined as RejectedIcon,
    FilterList as FilterIcon,
    DoneOutline as CompleteFilterIcon,
    PendingOutlined as PendingFilterIcon,
    BlockOutlined as RejectedFilterIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import config from '../config';
import PageNotFound from '../common/PageNotFound';
import { setCurrentPage } from '../store/authSlice';
import { useSnackbar } from '../hooks/SnackBarProvider';

const UserRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [processingRequest, setProcessingRequest] = useState(null);
    const openSnackbar = useSnackbar();

    const dispatch = useDispatch();

    const userRole = useSelector(state => state?.auth?.userInfo?.role);
    const isAdmin = userRole === 'admin';

    useEffect(() => {
        if (isAdmin) {
            fetchRequests();
        }
        // eslint-disable-next-line
    }, []);

    useLayoutEffect(() => {
        dispatch(setCurrentPage('User Requests'));
    }, [dispatch]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.SERVER_BASE_ADDRESS}/user/requests`, { withCredentials: true });
            setRequests(response?.data || []);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err?.response?.status === 401) {
                window.location.href = '/login';
            }
            setError(err?.response?.data?.message || err?.message);
            openSnackbar(err?.response?.data?.message || err?.message, 'danger');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            setProcessingRequest(id);
            const apiName = status === 'approved' ? `approveRequest` : `rejectRequest`;
            await axios.get(`${config.SERVER_BASE_ADDRESS}/user/${apiName}/${id}`, { withCredentials: true });

            openSnackbar(`Request ${status === 'approved' ? 'Approved' : 'Rejected'} Successfully!`, 'success');
            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req?._id === id ? { ...req, status } : req
                )
            );
            setProcessingRequest(null);
        } catch (err) {
            setProcessingRequest(null);
            openSnackbar(err?.response?.data?.message || err?.message, 'danger');
            if (err?.response?.status === 401) {
                window.location.href = '/login';
            }
        }
    };

    const filteredRequests = requests.filter(request =>
        filterStatus === 'all' || request.status === filterStatus
    );

    const renderFilterButtons = () => (
        <Box display="flex" justifyContent="center" mb={3}>
            <Button
                startIcon={<FilterIcon />}
                sx={{
                    mr: 1,
                    borderRadius: 3,
                    background: filterStatus === 'all' ? 'var(--primary-color)' : 'var(--bg-color)',
                    color: filterStatus === 'all' ? 'white' : 'inherit'
                }}
                onClick={() => setFilterStatus('all')}
                variant={filterStatus === 'all' ? 'contained' : 'outlined'}
            >
                All
            </Button>
            <Button
                startIcon={<PendingFilterIcon />}
                sx={{
                    mr: 1,
                    borderRadius: 3,
                    background: filterStatus === 'pending' ? 'var(--primary-color)' : 'var(--bg-color)',
                    color: filterStatus === 'pending' ? 'white' : 'inherit'
                }}
                onClick={() => setFilterStatus('pending')}
                variant={filterStatus === 'pending' ? 'contained' : 'outlined'}
            >
                Pending
            </Button>
            <Button
                startIcon={<CompleteFilterIcon />}
                sx={{
                    mr: 1,
                    borderRadius: 3,
                    background: filterStatus === 'approved' ? 'var(--primary-color)' : 'var(--bg-color)',
                    color: filterStatus === 'approved' ? 'white' : 'inherit'
                }}
                onClick={() => setFilterStatus('approved')}
                variant={filterStatus === 'approved' ? 'contained' : 'outlined'}
            >
                Approved
            </Button>
            <Button
                startIcon={<RejectedFilterIcon />}
                sx={{
                    borderRadius: 3,
                    background: filterStatus === 'rejected' ? 'var(--primary-color)' : 'var(--bg-color)',
                    color: filterStatus === 'rejected' ? 'white' : 'inherit'
                }}
                onClick={() => setFilterStatus('rejected')}
                variant={filterStatus === 'rejected' ? 'contained' : 'outlined'}
            >
                Rejected
            </Button>
        </Box>
    );

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <PendingIcon color="warning" />;
            case 'approved': return <ApprovedIcon color="success" />;
            case 'rejected': return <RejectedIcon color="error" />;
            default: return null;
        }
    };

    const renderRequestCard = (request) => (
        <Grid item xs={12} md={4} key={request._id}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                }}
                whileHover={{
                    scale: 1.03,
                    transition: { duration: 0.2 }
                }}
            >
                <Box
                    sx={{
                        background: 'linear-gradient(145deg, var(--bg-color), rgba(255,255,255,0.9))',
                        borderRadius: 3,
                        boxShadow: '0 10px 20px rgba(0,0,0,0.07)',
                        border: '1px solid var(--border-color)',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        height: '130px',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            background:
                                request.status === 'pending' ? 'var(--warning-color)' :
                                    request.status === 'approved' ? 'var(--success-color)' :
                                        'var(--error-color)',
                            zIndex: 1
                        }
                    }}
                    p={3}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >
                        <Box display="flex" alignItems="center">
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                    color: '#000',
                                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.03)',
                                }}
                            >
                                {request.email.charAt(0).toUpperCase()}
                            </Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                color="text.primary"
                            >
                                {request.email}
                            </Typography>
                        </Box>

                        <Chip
                            icon={getStatusIcon(request.status)}
                            label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            color={
                                request.status === 'pending' ? 'warning' :
                                    request.status === 'approved' ? 'success' : 'error'
                            }
                            size="small"
                            variant="soft"
                        />
                    </Box>

                    {request.status === 'pending' && (
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            mt={2}
                            sx={{
                                '& .MuiButton-root': {
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }
                            }}
                        >
                            <Tooltip title="Reject" arrow color='danger' variant='outlined' placement='right' onClick={() => updateStatus(request?._id, 'rejected')}>
                                <IconButton color='danger' variant='outlined'>
                                    <RejectedIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Approve" arrow color='success' variant='outlined' placement='left' onClick={() => updateStatus(request?._id, 'approved')}>
                                <IconButton color='success' variant='soft'>
                                    <ApprovedIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}

                    {processingRequest === request._id && (
                        <Backdrop
                            open={true}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: (theme) => theme.zIndex.drawer + 1,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <CircularProgress
                                color="success"
                                size={50}
                            />
                            <Typography
                                variant="body2"
                                mt={2}
                                color="text.secondary"
                            >
                                Processing request...
                            </Typography>
                        </Backdrop>
                    )}
                </Box>
            </motion.div>
        </Grid>
    );

    const renderContent = () => {
        if (loading) return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress color='success' />
            </Box>
        );

        if (error) return (
            <Box textAlign="center" color="error.main" py={8}>
                <Typography variant="h6">{error}</Typography>
            </Box>
        );

        if (filteredRequests.length === 0) return (
            <Box textAlign="center" py={8}>
                <Typography variant="h6" color="textSecondary">No User Requests!</Typography>
            </Box>
        );

        return (
            <Grid container spacing={2}>
                {filteredRequests.map(renderRequestCard)}
            </Grid>
        );
    };

    if (!isAdmin) {
        return <PageNotFound />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box mb={4} textAlign="center">
                <Typography variant="h3" fontWeight="bold" sx={{ color: 'var(--primary-color)' }}>
                    User Requests
                </Typography>
            </Box>
            {renderFilterButtons()}
            {renderContent()}
        </Container>
    );
};

export default UserRequests;