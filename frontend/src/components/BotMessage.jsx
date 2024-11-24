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
import TypeWriter from '../common/TypeWriter';
import config from '../config';

const BotMessage = ({ messages, currentModel, onVote, isOldMessage }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const messagesCount = messages?.length;
    const [selectedModel, setSelectedModel] = useState(currentModel);

    useEffect(() => {
        setSelectedModel(currentModel);
    }, [currentModel]);

    if (!messages || messagesCount === 0) {
        return null;
    }


    const handleVote = (index) => {
        setSelectedModel(index);
        onVote?.(index);
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
                        flex: messagesCount === 1 ? '0 1 100%' : 1,
                        maxWidth: messagesCount === 1 ? '800px' : 'none',
                        margin: messagesCount === 1 ? '0 auto' : 0,
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
                    {/* Model Header */}
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
                                    animation: messagesCount > 1 ? 'pulse 2s infinite' : 'none',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 1 },
                                        '50%': { opacity: 0.5 },
                                        '100%': { opacity: 1 }
                                    }
                                }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {messagesCount > 1 ? config.MODEL_OPTIONS[index].label : 'Response'}
                            </Typography>
                        </Box>

                        {messagesCount > 1 && (
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
                        )}
                    </Box>

                    {/* Response Content */}
                    <Box sx={{ p: 3, position: 'relative' }}>
                        <TypeWriter
                            text={cleanText(response)}
                            speed={10}
                            disableTypingEffect={isOldMessage}
                        />
                    </Box>

                    {/* Selected Model Indicator */}
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