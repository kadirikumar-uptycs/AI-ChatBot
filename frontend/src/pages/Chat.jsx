import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, IconButton, CircularProgress, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import TypeWriter from '../common/TypeWriter';
import { LoadingWave } from '../common/LoadingWave';
import { setCurrentPage } from '../store/authSlice';

const Chat = () => {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [loadingMessage, setLoadingMessage] = useState('Thinking...');
    const messagesEndRef = useRef(null);
    const userName = useSelector(state => state?.auth?.userInfo?.name);

    const handleSubmit = async () => {
        const isFirstMessage = messages.length === 0;
        if (prompt.trim()) {
            setLoading(true);
            setLoadingMessage('Thinking...');
            setMessages((prevMessages) => [...prevMessages, { sender: 'You', content: prompt }]);
            setPrompt('');

            try {
                const response = await axios.post(`http://localhost:17291/api/chat?firstMessage=${isFirstMessage}`, { prompt }, { withCredentials: true });
                const botMessage = response?.data?.message;
                setMessages((prevMessages) => [...prevMessages, { sender: 'Therapy Bot', content: botMessage }]);
            } catch (error) {
                console.log(error);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'Therapy Bot', content: 'Apologies, there seems to be an issue. Please try again later.' },
                ]);
            } finally {
                setLoading(false);
            }
        }
    };

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Chat with Therapy Bot'))
        // eslint-disable-next-line
    }, [])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleKeyDown = (e) => {
        if (loading) return
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    useEffect(() => {
        let timer;
        if (loading) {
            if (loadingMessage === 'Thinking...') scrollToBottom();
            timer = setTimeout(() => setLoadingMessage('Just a moment...'), 5000);
            timer = setTimeout(() => setLoadingMessage("Hold on, I'm processing your request...."), 10000);
            setTimeout(() => setLoadingMessage('Almost there...'), 15000);
            setTimeout(() => setLoadingMessage("I'm on it! Please wait a moment."), 20000);
        }
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}
        >
            {
                !messages.length &&
                <Typography component="div" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <TypeWriter
                        text={`Hello **\`${userName || 'User'}\`**!\nI’m here to listen and support you.\nWhat's on your mind today?`}
                        speed={15}
                        disableCopy={true}
                        styles={{
                            fontSize: '32px',
                            fontFamily: 'GreatVibes, cursive',
                            background: 'linear-gradient(90deg, darkgreen, #017931, darkgreen, #017931, darkgreen)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                            lineHeight: '1.5',
                            padding: '10px',
                            wordWrap: 'break-word',
                        }}
                    />
                </Typography>
            }
            <Box
                sx={{
                    width: '100%',
                    maxHeight: 'calc(100% - 96px)',
                    display: 'flex',
                    justifyContent: 'center',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    marginBottom: '20px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '43%',
                        paddingBottom: '30px',
                    }}
                >
                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                fontFamily: 'Capriola',
                                justifyContent: message.sender === 'You' ? 'flex-end' : 'flex-start',
                                alignItems: 'center',
                                gap: '11px',
                                mb: 2,
                            }}
                        >
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    color: message.sender === 'You' ? 'white' : 'black',
                                    whiteSpace: 'pre-wrap',
                                    boxShadow: 'none',
                                    background: 'transparent',
                                    display: 'flex',
                                    justifyContent: message.sender === 'You' ? 'flex-end' : 'flex-start',
                                    width: message.sender === 'You' ? '70%' : '100%',
                                }}
                            >
                                {message.sender === 'Therapy Bot' ? (
                                    <TypeWriter
                                        text={
                                            message?.content
                                                .replace(/<\|im_heart\|>/g, '❤️')
                                                .replace(/<\|im_ended\|>/g, '')
                                                .replace(/<\|im_endo\|>/g, '')
                                                .replace(/<\/?s>/g, '')
                                                .replace(/<\/s/, '')
                                        }
                                        speed={10}
                                        scrollFunction={scrollToBottom}
                                    />
                                ) : (
                                    <Typography
                                        sx={{
                                            color: '#000',
                                            background: 'rgba(0, 0, 0, 0.09)',
                                            borderRadius: '7px',
                                            fontFamily: 'Capriola',
                                            padding: '11px',
                                            width: 'fit-content',
                                            maxWidth: '100%',
                                        }}
                                    >{message.content}
                                    </Typography>
                                )}
                            </Paper>
                        </Box>
                    ))}
                    {loading && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <CircularProgress size={24} sx={{ mr: 2 }} color='success' />
                            <LoadingWave text={loadingMessage} />
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    borderRadius: 3,
                    width: '43%',
                    height: 'max(56px, fit-content)',
                    px: 2,
                    py: 1,
                    boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)',
                    background: '#fff',
                }}
            >
                <TextField
                    variant="standard"
                    placeholder="Type your message..."
                    fullWidth
                    multiline
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    InputProps={{ disableUnderline: true }}
                    sx={{
                        mr: 2,
                        marginBottom: '5px',
                        '& .MuiInputBase-root': { fontSize: '1rem', color: '#333' },
                    }}
                />
                <IconButton
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading || !prompt.trim()}
                    sx={{
                        bgcolor: 'var(--primary-color)',
                        color: 'white',
                        marginBottom: '3px',
                        '&:hover': { boxShadow: '0 0 3px var(--primary-color)', color: 'rgb(61, 91, 63, 0.8)', bgcolor: 'rgba(0,0,0,0.07)' },
                    }}
                >
                    <SendIcon sx={{ marginLeft: '3px' }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Chat;
