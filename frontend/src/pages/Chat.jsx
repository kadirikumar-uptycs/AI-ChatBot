import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    CircularProgress,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Warning as WarningIcon,
    Report as ReportIcon
} from '@mui/icons-material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ChatOptions from '../components/ChatOptions';
import TypeWriter from '../common/TypeWriter';
import { LoadingWave } from '../common/LoadingWave';
import BotMessage from '../components/BotMessage';
import { useSnackbar } from '../hooks/SnackBarProvider';
import { setCurrentPage } from '../store/authSlice';
import config from '../config';

const Chat = () => {
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const userName = useSelector(state => state?.auth?.userInfo?.name);
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Thinking...');
    const [showConfirmDialog, setConfirmDialog] = useState(false);
    const [showModelChangeConfirmDialog, setShowModelChangeConfirmDialog] = useState(false);
    const [isClearingHistory, setIsClearingHistory] = useState(false);
    const [isChangingModel, setIsChangingModel] = useState(false);
    const [currentModel, setCurrentModel] = useState(1);
    const [newModel, setNewModel] = useState(currentModel);

    const isLimitExceeded = messages?.length >= config.MAX_MESSAGES * 2;

    const openSnackbar = useSnackbar();

    const handleSubmit = async () => {
        if (prompt.trim()) {
            setLoading(true);
            setLoadingMessage('Thinking...');
            setMessages((prevMessages) => [...prevMessages, { role: 'user', content: prompt }]);
            setPrompt('');

            try {
                const response = await axios.post(`http://localhost:17291/api/chat`, { prompt, model: currentModel }, { withCredentials: true });
                const botMessage = response?.data?.content;
                setMessages((prevMessages) => [...prevMessages.map(message => ({ ...message, old: true })), { role: 'assistant', content: botMessage }]);
                scrollToBottom();
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


    const onModelPreference = async (preferredModel) => {
        setCurrentModel(preferredModel);
        try {
            await axios.post(`${config.SERVER_BASE_ADDRESS}/api/modelPreference`,
                { model: preferredModel },
                { withCredentials: true },
            );
        } catch (error) {
            console.log(error);
            openSnackbar(error?.response?.data?.message || 'Error while choosing the preferred model');
        }
    }

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Chat with Therapy Bot'))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setPageLoading(true);
                const response = await axios.get(`${config.SERVER_BASE_ADDRESS}/api/chatHistory`, { withCredentials: true });
                const conversationHistory = response?.data || { messages: [], model: 0 };
                const conversationMessages = conversationHistory?.messages?.map(message => message?.role === 'assistant' ? { ...message, old: true } : message)
                setMessages(conversationMessages);
                setCurrentModel(conversationHistory?.model || 0);
                if (!conversationMessages || !Array.isArray(conversationMessages) || !conversationMessages?.length) {
                    openSnackbar('No Conversations Found', 'warning');
                }
            } catch (error) {
                openSnackbar(error?.response?.data?.message || error?.message || 'Failed to fetch the History', 'danger')
            } finally {
                setPageLoading(false);
                setTimeout(() => {
                    scrollToBottom();
                }, 200);
            }
        }
        fetchHistory();
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

    const onNewChat = () => {
        setConfirmDialog(true);
    }

    const handleclearHistory = async (requestedModelChange) => {
        try {
            if (requestedModelChange) {
                setIsChangingModel(true);
            } else {
                setIsClearingHistory(true);
            }

            await axios.delete(`${config.SERVER_BASE_ADDRESS}/api/chatHistory`, { withCredentials: true });
            setMessages([]);
        } catch (error) {
            openSnackbar(error?.response?.data?.message || error?.message || 'Failed to clear the chat', 'danger');
        } finally {
            if (requestedModelChange) {
                setIsChangingModel(false);
                setShowModelChangeConfirmDialog(false);
                setCurrentModel(newModel);
            } else {
                setIsClearingHistory(false);
                setConfirmDialog(false);
            }
        }
    }

    const onModelChange = (newModel) => {
        if (messages.length) {
            setShowModelChangeConfirmDialog(true);
            setNewModel(newModel);
        } else {
            setCurrentModel(newModel);
        }
    }

    useEffect(() => {
        let timer;
        if (loading) {
            if (loadingMessage === 'Thinking...') {
                scrollToBottom();
            }
            timer = setTimeout(() => setLoadingMessage('Just a moment...'), 5000);
            timer = setTimeout(() => setLoadingMessage("Hold on, I'm processing your request...."), 10000);
            setTimeout(() => setLoadingMessage('Almost there...'), 15000);
            setTimeout(() => setLoadingMessage("I'm on it! Please wait a moment."), 20000);
        }
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    if (pageLoading) return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}
        >
            <CircularProgress color='success' />
            <Typography color='success' variant='body1' marginTop={3}>Fetching History...</Typography>
        </Box>
    )

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                position: 'relative',
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
                        alignItems: 'center',
                        width: '100%',
                        paddingBottom: '30px',
                    }}
                >
                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                fontFamily: 'Capriola',
                                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                                alignItems: 'center',
                                gap: '11px',
                                width: message?.role === 'user' ? '43%' : '100%',
                            }}
                        >
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    color: message.role === 'user' ? 'white' : 'black',
                                    whiteSpace: 'pre-wrap',
                                    boxShadow: 'none',
                                    background: 'transparent',
                                    display: 'flex',
                                    justifyContent: message.role === 'user' ? 'flex-end' : 'center',
                                    width: message.role === 'user' ? '70%' : '100%',
                                }}
                            >
                                {message.role === 'assistant' ? (
                                    <BotMessage
                                        messages={message?.content}
                                        currentModel={currentModel}
                                        onVote={onModelPreference}
                                        isOldMessage={message?.old}
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
                                            overflowY: 'auto',
                                            overflowWrap: 'break-word',
                                            wordWrap: 'break-word',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            hyphens: 'auto',
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
                                width: '43%'
                            }}
                        >
                            <CircularProgress size={24} sx={{ mr: 2 }} color='success' />
                            <LoadingWave text={loadingMessage} />
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Box>
            </Box>
            {!loading &&
                <ChatOptions
                    onNewChat={onNewChat}
                    disableNewChat={!messages.length}
                    onModelChange={onModelChange}
                    currentModel={currentModel}
                />
            }
            {
                !isLimitExceeded
                    ?
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
                            <ArrowUpwardIcon />
                        </IconButton>
                    </Box>
                    :
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 0 3px red',
                        padding: '11px',
                        borderRadius: '7px',
                        gap: 1,
                        marginTop: '21px',
                    }}>
                        <ReportIcon color='error' />
                        <Typography color='error' variant='body1'>You have hit the max limit of messages, Please start a new chat yourself</Typography>
                    </Box>
            }

            {/* Clear History Confirmation */}
            <Dialog
                open={showConfirmDialog}
                onClose={() => !isClearingHistory && setConfirmDialog(false)}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle
                    id="delete-dialog-title"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'error.main'
                    }}
                >
                    <WarningIcon color="error" />
                    Clear History
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to clear the chat history?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDialog(false)}
                        color="inherit"
                        disabled={isClearingHistory}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => { handleclearHistory(false) }}
                        variant="contained"
                        color="error"
                        disabled={isClearingHistory}
                        startIcon={isClearingHistory ? <CircularProgress color='error' size={20} /> : <DeleteIcon />}
                    >
                        {isClearingHistory ? 'Clearing...' : 'Clear History'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Model Change Confirmation */}
            <Dialog
                open={showModelChangeConfirmDialog}
                onClose={() => !isChangingModel && setShowModelChangeConfirmDialog(false)}
                aria-labelledby="change-model-dialog-title"
                aria-describedby="change-model-dialog-description"
            >
                <DialogTitle
                    id="change-model-dialog-title"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'error.main'
                    }}
                >
                    <WarningIcon color="error" />
                    Change Model
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="change-model-dialog-description">
                        Are you sure you want to change the model?
                        This can erase the current conversation history.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowModelChangeConfirmDialog(false)}
                        color="inherit"
                        disabled={isChangingModel}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => { handleclearHistory(true) }}
                        variant="contained"
                        color="error"
                        disabled={isChangingModel}
                        startIcon={isChangingModel ? <CircularProgress color='error' size={20} /> : <ChangeCircleIcon />}
                    >
                        {isClearingHistory ? 'Changing...' : 'Change Model'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Chat;
