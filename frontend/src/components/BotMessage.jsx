import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    IconButton,
    useTheme,
    Chip,
    Tooltip,
    useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import TypeWriter from '../common/TypeWriter';
import config from '../config';

const BotMessage = ({ messages, currentModel, onVote, isOldMessage }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const messagesCount = messages?.length;
    const [selectedModel, setSelectedModel] = useState(currentModel);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(currentModel !== -1 ? currentModel : 0);

    useEffect(() => {
        setSelectedModel(currentModel);
        if (currentModel !== -1) {
            setCurrentMessageIndex(currentModel);
        }
    }, [currentModel]);

    if (!messages || messagesCount === 0) {
        return null;
    }

    const handleVote = (index) => {
        setSelectedModel(index);
        onVote?.(index);
    };

    const handlePrevious = () => {
        setCurrentMessageIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentMessageIndex(prev => Math.min(messagesCount - 1, prev + 1));
    };

    const cleanText = (text) => {
        return text
            ?.replace(/<\|im_heart\|>/g, '❤️')
            ?.replace(/<\|im_ended\|>/g, '')
            ?.replace(/<\|im_endo\|>/g, '')
            ?.replace(/<\/?s>/g, '')
            ?.replace(/<\/s/, '');
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 }
        }
    };

    if (messagesCount === 1) {
        return <Box sx={{
            width: '43%',
        }}>
            <TypeWriter
                text={cleanText(messages[0])}
                speed={10}
                disableTypingEffect={isOldMessage}
            />
        </Box>
    }

    const NavigationControls = () => (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
        }}>
            <IconButton
                onClick={handlePrevious}
                disabled={currentMessageIndex === 0}
                sx={{
                    bgcolor: theme.palette.background.paper,
                    '&:hover': { bgcolor: theme.palette.action.hover }
                }}
            >
                <NavigateBeforeIcon />
            </IconButton>
            <Typography variant="body1">
                {currentMessageIndex + 1} / {messagesCount}
            </Typography>
            <IconButton
                onClick={handleNext}
                disabled={currentMessageIndex === messagesCount - 1}
                sx={{
                    bgcolor: theme.palette.background.paper,
                    '&:hover': { bgcolor: theme.palette.action.hover }
                }}
            >
                <NavigateNextIcon />
            </IconButton>
        </Box>
    );

    // If a model is selected, show single message with navigation
    if (currentModel !== -1) {
        return (
            <Box
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                sx={{
                    width: '43%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    alignItems: 'stretch'
                }}
            >
                <Paper
                    component={motion.div}
                    variants={itemVariants}
                    elevation={3}
                    sx={{
                        flex: 1,
                        maxWidth: '800px',
                        position: 'relative',
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(241,241,241,0.9) 100%)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[6]
                        }
                    }}
                >
                    <Box
                        sx={{
                            p: 2,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            background: theme.palette.background.default,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AutoAwesomeIcon
                                sx={{
                                    color: theme.palette.primary.main,
                                    animation: 'pulse 2s infinite',
                                }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {config.MODEL_OPTIONS[currentMessageIndex].label}
                            </Typography>
                        </Box>
                        {
                            currentModel === currentMessageIndex
                            &&
                            (
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                    >
                                        <Chip
                                            label="Preferred Response"
                                            color="success"
                                            icon={<CheckCircleIcon />}
                                            sx={{
                                                position: 'absolute',
                                                top: 16,
                                                right: 16,
                                                zIndex: 1
                                            }}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            )
                        }
                    </Box>

                    <Box sx={{ p: 3, position: 'relative' }}>
                        <TypeWriter
                            text={cleanText(messages[currentMessageIndex])}
                            speed={10}
                            disableTypingEffect={isOldMessage}
                        />
                    </Box>
                </Paper>
                <NavigationControls />
            </Box>
        );
    }

    // side-by-side view when no model is selected
    return (
        <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
                width: '100%',
                p: { xs: 1, md: 3 },
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 3,
                alignItems: 'stretch'
            }}
        >
            {messages.map((response, index) => (
                <Paper
                    component={motion.div}
                    variants={itemVariants}
                    key={index}
                    elevation={3}
                    sx={{
                        flex: 1,
                        position: 'relative',
                        background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(145deg, rgba(66,66,66,0.7) 0%, rgba(33,33,33,0.9) 100%)'
                            : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(241,241,241,0.9) 100%)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[6]
                        }
                    }}
                >
                    <Box
                        sx={{
                            p: 2,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            background: theme.palette.background.default,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AutoAwesomeIcon
                                sx={{
                                    color: theme.palette.primary.main,
                                    animation: 'pulse 2s infinite',
                                }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {config.MODEL_OPTIONS[index].label}
                            </Typography>
                        </Box>

                        <Tooltip title={selectedModel === index ? "Preferred!" : "I prefer this"}>
                            <span>
                                <IconButton
                                    disabled={selectedModel >= 0}
                                    onClick={() => handleVote(index)}
                                    sx={{
                                        color: selectedModel === index ? theme.palette.success.main : theme.palette.text.secondary,
                                        transform: selectedModel === index ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                >
                                    <ThumbUpAltIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>

                    <Box sx={{ p: 3, position: 'relative' }}>
                        <TypeWriter
                            text={cleanText(response)}
                            speed={10}
                            disableTypingEffect={isOldMessage}
                        />
                    </Box>

                    <AnimatePresence>
                        {selectedModel === index && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Chip
                                    label="Preferred Response"
                                    color="success"
                                    icon={<CheckCircleIcon />}
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        zIndex: 1
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Paper>
            ))}
        </Box>
    );
};

export default BotMessage;