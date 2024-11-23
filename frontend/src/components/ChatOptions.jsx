import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Button
} from '@mui/material';
import Tooltip from '@mui/joy/Tooltip';
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import StreamIcon from '@mui/icons-material/Stream';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import LoupeIcon from '@mui/icons-material/Loupe';

const MODEL_OPTIONS = [
    { value: 1, label: 'Model 2 (V2)', icon: <NewReleasesRoundedIcon /> },
    { value: 0, label: 'Model 1 (V1)', icon: <StarRoundedIcon /> },
    // { value: -1, label: 'All', icon: <StreamIcon /> }
];

const ChatOptions = ({
    onNewChat,
    onModelChange,
    currentModel,
    disableNewChat
}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenModelMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseModelMenu = () => {
        setAnchorEl(null);
    };

    const handleModelSelect = (modelValue) => {
        onModelChange(modelValue);
        handleCloseModelMenu();
    };

    const selectedModelOption = MODEL_OPTIONS.find(
        option => option.value === currentModel
    ) || MODEL_OPTIONS[0];

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                width: '43%',
            }}
        >
            {/* New Chat Button */}
            <Tooltip title="Start New Chat" arrow variant='outlined' color='success'>
                <IconButton
                    onClick={onNewChat}
                    color="success"
                    disabled={disableNewChat}
                >
                    <LoupeIcon />
                </IconButton>
            </Tooltip>

            {/* Model Selection Dropdown */}
            <Button
                onClick={handleOpenModelMenu}
                color='success'
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                {selectedModelOption.icon}
                <Typography variant="body2">
                    {selectedModelOption.label}
                </Typography>
            </Button>

            {/* Model Selection Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseModelMenu}
            >
                {MODEL_OPTIONS.map((option) => (
                    <MenuItem
                        key={option.value}
                        onClick={() => handleModelSelect(option.value)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            ...(currentModel === option.value && {
                                backgroundColor: '#167d16',
                                color: '#f3f3f3',
                                '&:hover': {
                                    backgroundColor: 'success.light'
                                }
                            })
                        }}
                    >
                        {option.icon}
                        <Typography variant="body2">
                            {option.label}
                        </Typography>
                        {currentModel === option.value && <DoneAllIcon />}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default ChatOptions;