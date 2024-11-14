import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Container,
    CardActions,
    Chip,
    IconButton,
    Dialog,
    DialogContent,
    Fade,
} from '@mui/material';
import { styled } from '@mui/system';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MoodIcon from '@mui/icons-material/Mood';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import videos from '../assets/yoga/manifest.json';

// Custom styled components
const CircleBackground = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    height: '800px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(var(--primary-color-rgb), 0.1) 0%, rgba(var(--primary-color-rgb), 0) 70%)',
    zIndex: 0,
    pointerEvents: 'none',
}));

const VideoCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '30px',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out !important',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
    },
}));

const ThumbnailWrapper = styled(Box)({
    position: 'relative',
    paddingTop: '56.25%',
    overflow: 'hidden',
    '&:hover .play-overlay': {
        opacity: 1,
    },
});

const PlayOverlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
});

const CategoryButton = styled(Button)(({ selected }) => ({
    borderRadius: '25px',
    padding: '10px 25px',
    margin: '0 8px',
    transition: 'all 0.3s ease',
    background: selected ? 'var(--primary-color)' : 'transparent',
    border: '2px solid var(--primary-color)',
    color: selected ? 'white' : 'var(--primary-color)',
    '&:hover': {
        background: selected ? 'var(--primary-color)' : 'rgba(0, 100, 0, 0.05)',
        transform: 'translateY(-2px)',
    },
}));

const Yoga = () => {
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [openVideo, setOpenVideo] = useState(null);

    React.useEffect(() => {
        dispatch(setCurrentPage('Do Yoga'));
    }, [dispatch]);

    const categories = [
        { name: 'All', icon: <SelfImprovementIcon /> },
        { name: 'Beginner', icon: <MoodIcon /> },
        { name: 'Intermediate', icon: <FitnessCenterIcon /> },
        { name: 'Advanced', icon: <StarIcon /> },
    ];


    const filteredVideos = videos.filter(video =>
        selectedCategory === 'All' || video.category === selectedCategory
    );

    return (
        <Box sx={{ minHeight: '100vh', position: 'relative', pb: 8 }}>
            <CircleBackground />

            {/* Header Section */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{
                    textAlign: 'center',
                    pt: 1,
                    pb: 1,
                    position: 'relative',
                }}>
                    <SelfImprovementIcon
                        sx={{
                            fontSize: 60,
                            color: 'var(--primary-color)',
                            mb: 3
                        }}
                    />
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, var(--primary-color) 30%, #2E7D32 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2,
                        }}
                    >
                        Find Your Inner Balance
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '600px',
                            mx: 'auto',
                            mb: 6,
                        }}
                    >
                        Discover peace and strength through our curated yoga sessions
                    </Typography>

                    {/* Category Filters */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}>
                        {categories.map((category) => (
                            <CategoryButton
                                key={category.name}
                                selected={selectedCategory === category.name}
                                onClick={() => setSelectedCategory(category.name)}
                                startIcon={category.icon}
                            >
                                {category.name}
                            </CategoryButton>
                        ))}
                    </Box>
                </Box>

                {/* Videos Grid */}
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    {filteredVideos.map((video, index) => (
                        <Grid item xs={12} md={6} lg={4} key={video.id}>
                            <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                                <VideoCard>
                                    <ThumbnailWrapper>
                                        <Box
                                            component="img"
                                            src={video.thumbnailUrl}
                                            alt={video.title}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <PlayOverlay
                                            className="play-overlay"
                                            onClick={() => setOpenVideo(video)}
                                        >
                                            <IconButton
                                                sx={{
                                                    bgcolor: 'var(--primary-color)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        bgcolor: 'var(--primary-color)',
                                                        transform: 'scale(1.1)',
                                                    },
                                                }}
                                            >
                                                <PlayArrowIcon sx={{ fontSize: 40 }} />
                                            </IconButton>
                                        </PlayOverlay>
                                    </ThumbnailWrapper>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Chip
                                                label={video.category}
                                                sx={{
                                                    bgcolor: 'var(--primary-color)',
                                                    color: 'white',
                                                    fontWeight: 500,
                                                }}
                                            />
                                            <Typography
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    color: 'text.secondary',
                                                }}
                                            >
                                                <AccessTimeIcon fontSize="small" />
                                                {video.duration}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                color: 'var(--primary-color)',
                                            }}
                                        >
                                            {video.title}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, }}>
                                            with <span style={{ fontFamily: 'serif' }}>{video.instructor}</span>
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: '6',
                                                WebkitBoxOrient: 'vertical',
                                                height: '8.4em'
                                            }}
                                        >
                                            {video.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ p: 3, pt: 0 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={() => setOpenVideo(video)}
                                            sx={{
                                                bgcolor: 'var(--primary-color)',
                                                borderRadius: '25px',
                                                py: 1,
                                                '&:hover': {
                                                    bgcolor: 'var(--primary-color)',
                                                    filter: 'brightness(1.1)',
                                                },
                                            }}
                                            startIcon={<PlayArrowIcon />}
                                        >
                                            Start Practice
                                        </Button>
                                    </CardActions>
                                </VideoCard>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>

                {/* Video Dialog */}
                <Dialog
                    open={!!openVideo}
                    onClose={() => setOpenVideo(null)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '20px',
                            overflow: 'hidden',
                        }
                    }}
                >
                    <DialogContent sx={{ p: 0, position: 'relative' }}>
                        <IconButton
                            onClick={() => setOpenVideo(null)}
                            sx={{
                                position: 'absolute',
                                right: 16,
                                top: 16,
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                zIndex: 1,
                                '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        {openVideo && (
                            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                                <iframe
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        border: 0,
                                    }}
                                    src={`https://www.youtube.com/embed/${openVideo.videoId}?autoplay=1`}
                                    title={openVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
            </Container>
        </Box>
    );
};

export default Yoga;