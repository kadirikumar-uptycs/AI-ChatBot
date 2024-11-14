import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQuill } from 'react-quilljs';
import { setCurrentPage } from '../store/authSlice';
import { useSnackbar } from '../hooks/SnackBarProvider';
import axios from 'axios';
import config from '../config';
import 'quill/dist/quill.snow.css';

import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    IconButton,
    Divider,
    Tooltip,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';

import {
    Add as AddIcon,
    Save as SaveIcon,
    AutoStories as StoriesIcon,
    Delete as DeleteIcon,
    Warning as WarningIcon
} from '@mui/icons-material';


const StoryListItem = styled(ListItem)(({ theme, active }) => ({
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: active ? '#eee' : 'transparent',
    color: active ? 'darkgreen' : '#333',
    '&:hover': {
        backgroundColor: active
            ? theme.palette.primary.lighter
            : theme.palette.action.hover,
    },
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid rgba(0, 0, 0, 0.09)',
    borderLeft: active ? '3px solid darkgreen' : '1px solid rgba(0, 0, 0, 0.09)',
}));

const EditorContainer = styled(Paper)(({ theme }) => ({
    '& .ql-toolbar': {
        borderTopLeftRadius: theme.spacing(1),
        borderTopRightRadius: theme.spacing(1),
        border: `1px solid ${theme.palette.divider}`,
        borderBottom: 'none',
        background: '#f4f1ef',
    },
    '& .ql-container': {
        borderBottomLeftRadius: theme.spacing(1),
        borderBottomRightRadius: theme.spacing(1),
        border: `1px solid ${theme.palette.divider}`,
    },
}));

const WriteStory = () => {
    const dispatch = useDispatch();
    const openSnackBar = useSnackbar();
    const [title, setTitle] = useState('');
    const [savedStories, setSavedStories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeStory, setActiveStory] = useState(null);

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showNavigationDialog, setShowNavigationDialog] = useState(false);
    const [pendingNavigationIndex, setPendingNavigationIndex] = useState(null);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [storyToDelete, setStoryToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);


    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link'],
            [{ color: [] }, { background: [] }],
        ]
    };

    const { quill, quillRef } = useQuill({ modules });

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Write a Story'));
        fetchStories();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (quill && activeStory !== null && savedStories[activeStory]) {
            const story = savedStories[activeStory];
            setTitle(story.title);
            quill.root.innerHTML = story.content;
        }
    }, [activeStory, savedStories, quill]);

    const handleNewStoryClick = () => {
        if (checkUnsavedChanges()) {
            setShowConfirmDialog(true);
        } else {
            handleNewStory();
        }
    };

    const handleNewStory = () => {
        setTitle('');
        if (quill) {
            quill.root.innerHTML = '';
        }
        setActiveStory(null);
        setShowConfirmDialog(false);
    };

    const handleCancelNew = () => {
        setShowConfirmDialog(false);
    };

    const checkUnsavedChanges = () => {
        if (!quill || activeStory === null) return false;
        const currentContent = quill.root.innerHTML;
        const currentTitle = title;
        const savedContent = savedStories[activeStory]?.content || '';
        const savedTitle = savedStories[activeStory]?.title || '';

        return currentContent !== savedContent || currentTitle !== savedTitle;
    };

    const handleStorySelect = (index) => {
        if (isSaving) return;

        if (checkUnsavedChanges()) {
            setPendingNavigationIndex(index);
            setShowNavigationDialog(true);
        } else {
            proceedWithNavigation(index);
        }
    };

    const proceedWithNavigation = (index) => {
        setActiveStory(index);
        setShowNavigationDialog(false);
        setPendingNavigationIndex(null);
    };

    const cancelNavigation = () => {
        setShowNavigationDialog(false);
        setPendingNavigationIndex(null);
    };

    const handleSaveStory = async () => {
        if (!title) {
            openSnackBar('Title should be provided', 'danger');
            return;
        }

        const content = quill?.root.innerText.trim();
        if (!content) {
            openSnackBar('Story should be provided', 'danger');
            return;
        }

        setIsSaving(true);
        try {
            if (activeStory !== null) {
                const storyId = savedStories[activeStory]._id;
                await axios.put(
                    `${config.SERVER_BASE_ADDRESS}/api/story/${storyId}`,
                    { title, content },
                    { withCredentials: true }
                );
            } else {
                await axios.post(
                    `${config.SERVER_BASE_ADDRESS}/api/story`,
                    { title, content },
                    { withCredentials: true }
                );
            }

            openSnackBar('Story saved successfully!', 'success');
            fetchStories();

            if (activeStory === null) {
                setTitle('');
                quill.root.innerHTML = '';
            }
        } catch (error) {
            console.log("Error saving story:", error);
            openSnackBar(error?.response?.data?.message || error?.message, 'danger');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = (story, event) => {
        event.stopPropagation();
        setStoryToDelete(story);
        setShowDeleteDialog(true);
    };

    const handleDeleteStory = async () => {
        if (!storyToDelete) return;

        setIsDeleting(true);
        try {
            await axios.delete(
                `${config.SERVER_BASE_ADDRESS}/api/story/${storyToDelete._id}`,
                { withCredentials: true }
            );

            openSnackBar('Story deleted successfully!', 'success');

            // If the deleted story was active, clear the editor
            if (activeStory !== null && savedStories[activeStory]._id === storyToDelete._id) {
                setTitle('');
                if (quill) {
                    quill.root.innerHTML = '';
                }
                setActiveStory(null);
            }
            fetchStories();
        } catch (error) {
            console.error("Error deleting story:", error);
            openSnackBar(error?.response?.data?.message || error?.message, 'danger');
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
            setStoryToDelete(null);
        }
    };

    const fetchStories = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${config.SERVER_BASE_ADDRESS}/api/stories`,
                { withCredentials: true }
            );
            setSavedStories(response?.data);
        } catch (error) {
            console.error("Error fetching stories:", error);
            openSnackBar(error?.response?.data?.message || error?.message, 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2, bgcolor: 'var(--body-color)', height: '70%' }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper sx={{ p: 2, height: '100%', bgcolor: 'var(--bg-color)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
                            <Typography variant="h6" component="h2">
                                Your Stories
                            </Typography>
                            <Button
                                startIcon={<AddIcon />}
                                color='success'
                                variant="contained"
                                onClick={handleNewStoryClick}
                                disabled={activeStory === null}
                                size="small"
                                sx={{
                                    borderRadius: '17px',
                                    padding: '7px 13px'
                                }}
                            >
                                New Story
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress color='success' />
                            </Box>
                        ) : savedStories.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                <StoriesIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                                <Typography>No stories yet. Start writing!</Typography>
                            </Box>
                        ) : (
                            <List sx={{ maxHeight: '80vh', overflow: 'auto' }}>
                                {savedStories.map((story, index) => (
                                    <StoryListItem
                                        key={index}
                                        active={activeStory === index}
                                        onClick={() => handleStorySelect(index)}
                                        disabled={isSaving}
                                        secondaryAction={
                                            <Tooltip title="Delete Story" color='error'>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={(e) => handleDeleteClick(story, e)}
                                                    disabled={isSaving || isDeleting}
                                                    sx={{
                                                        visibility: activeStory === index ? 'visible' : 'hidden',
                                                        '&:hover': { color: 'error.main' }
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    >
                                        <ListItemText
                                            primary={story.title}
                                            secondary={new Date(story.createdAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                            primaryTypographyProps={{
                                                fontWeight: activeStory === index ? 600 : 400
                                            }}
                                        />
                                    </StoryListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8} lg={9}>
                    <Paper sx={{ p: 3, background: 'var(--bg-color)' }}>
                        <TextField
                            fullWidth
                            variant="standard"
                            color='success'
                            autoComplete='off'
                            placeholder="Enter story title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 3 }}
                            InputProps={{
                                sx: {
                                    fontSize: '1.5rem',
                                    fontWeight: 500,
                                }
                            }}
                        />

                        <EditorContainer elevation={0}>
                            <div ref={quillRef} style={{ height: '400px', background: '#fffcf9' }} />
                        </EditorContainer>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                variant="contained"
                                color='success'
                                startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                                onClick={handleSaveStory}
                                disabled={isSaving}
                                sx={{ px: 4 }}
                            >
                                {isSaving ? 'Saving...' : activeStory !== null ? 'Update Story' : 'Save Story'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={showDeleteDialog}
                onClose={() => !isDeleting && setShowDeleteDialog(false)}
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
                    Delete Story
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete "{storyToDelete?.title}"?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowDeleteDialog(false)}
                        color="inherit"
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteStory}
                        variant="contained"
                        color="error"
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Story'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Update Confirmation Dialog */}
            <Dialog
                open={showConfirmDialog}
                onClose={handleCancelNew}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="warning" />
                    Unsaved Changes
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You have unsaved changes in your current story. Starting a new story will discard these changes.
                        Are you sure you want to continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelNew} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleNewStory}
                        variant="contained"
                        color="success"
                        autoFocus
                    >
                        Start New Story
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Navigation Confirmation Dialog */}
            <Dialog
                open={showNavigationDialog}
                onClose={cancelNavigation}
                aria-labelledby="navigation-dialog-title"
                aria-describedby="navigation-dialog-description"
            >
                <DialogTitle id="navigation-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="warning" />
                    Unsaved Changes
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="navigation-dialog-description">
                        You have unsaved changes in your current story. Switching to another story will discard these changes.
                        Are you sure you want to continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelNavigation} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => proceedWithNavigation(pendingNavigationIndex)}
                        variant="contained"
                        color="success"
                        autoFocus
                    >
                        Switch Story
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default WriteStory;