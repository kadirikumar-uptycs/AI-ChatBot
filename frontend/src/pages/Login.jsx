import React, { useState, useLayoutEffect } from "react";
import axios from 'axios';
import { useSnackbar } from "../hooks/SnackBarProvider";
import { FcGoogle } from "react-icons/fc";
import config from '../config';
import { Box, Button, Container, Paper, TextField, Typography, Divider } from "@mui/material";


export default function Login() {

    const [userEmail, setUserEmail] = useState("");
    const openSnackbar = useSnackbar();
    const backendUrl = config.SERVER_BASE_ADDRESS;

    const handleGoogleLogin = () => {
        window.open(`${backendUrl}/auth/google`, '_self');
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    
    const handleUserRequest = async () => {
        if (!validateEmail(userEmail)) {
            openSnackbar('Please enter a valid email address', 'danger');
            return;
        }

        try {
            let res = await axios.post(`${backendUrl}/request`, { email: userEmail }, { withCredentials: true });
            openSnackbar(res?.data?.message || 'Request Sent to Admin!', 'success');
            setUserEmail('');
        } catch (error) {
            console.log(error);
            openSnackbar(error?.response?.data?.message || error?.message || 'Error while requesting for access', 'danger');
        }
    };

    useLayoutEffect(() => {
        document.title = 'Login';
    }, []);

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, height: 350, textAlign: 'center' }}>
                <Typography variant="h5" component="h2" fontWeight="bold" color="text.primary" gutterBottom>
                    Welcome Back!
                </Typography>

                <Box sx={{ mt: 2 }}>
                    <TextField
                        type="email"
                        label="Enter your email to request access"
                        variant="outlined"
                        fullWidth
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        onClick={handleUserRequest}
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Request Access
                    </Button>
                </Box>

                <Divider sx={{ my: 3 }}>or</Divider>

                <Button
                    onClick={handleGoogleLogin}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    startIcon={<FcGoogle />}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: 'text.primary',
                        padding: '10px 5px'
                    }}
                >
                    Sign In with Google
                </Button>
            </Paper>
        </Container>
    );
}