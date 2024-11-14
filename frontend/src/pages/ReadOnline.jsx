import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Button,
    Chip,
    Container,
    CardActions,
} from '@mui/material';
import { styled } from '@mui/system';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import SpaPandaSvgIcon from '@mui/icons-material/Spa';
import blogs from '../assets/blogs/manifest.json';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: 'var(--bg-color)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
    },
    borderRadius: '16px',
    overflow: 'hidden',
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    fontWeight: 600,
    zIndex: 1,
}));


const ReadOnline = () => {
    const dispatch = useDispatch();
    const [selectedMood, setSelectedMood] = useState('All');

    React.useEffect(() => {
        dispatch(setCurrentPage('Read Online'));
    }, [dispatch]);

    const moods = [
        {
            name: 'All',
            icon: <SpaPandaSvgIcon />,
            description: 'All Articles'
        },
        {
            name: 'Peaceful',
            icon: <FilterDramaIcon />,
            description: 'Calming Reads'
        },
        {
            name: 'Mindfulness',
            icon: <SelfImprovementIcon />,
            description: 'Mindful Practices'
        },
        {
            name: 'Self-Discovery',
            icon: <PsychologyIcon />,
            description: 'Inner Exploration'
        },
        {
            name: 'Growth',
            icon: <FavoriteIcon />,
            description: 'Personal Development'
        }
    ];
    const filteredBlogs = selectedMood === 'All' ? blogs : blogs.filter(blog => blog.mood === selectedMood);

    return (
        <Box sx={{
            height: '100%',
            bgcolor: 'var(--bg-color)',
            pb: 8
        }}>
            <Container maxWidth="lg">
                {/* Header Sectionl */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            color: 'var(--primary-color)',
                            fontWeight: 700,
                            mb: 3,
                        }}
                    >
                        Therapeutic Reads
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'text.secondary',
                            mb: 6,
                            maxWidth: '800px',
                            mx: 'auto'
                        }}
                    >
                        Discover calming stories and insights to nurture your mind and soul
                    </Typography>

                    {/* Mood Filters */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                            mb: 6
                        }}
                    >
                        {moods.map((mood) => (
                            <Button
                                key={mood.name}
                                variant={selectedMood === mood.name ? "contained" : "outlined"}
                                onClick={() => setSelectedMood(mood.name)}
                                sx={{
                                    borderRadius: '20px',
                                    px: 3,
                                    py: 1,
                                    backgroundColor: selectedMood === mood.name ? 'var(--primary-color)' : 'transparent',
                                    borderColor: 'var(--primary-color)',
                                    color: selectedMood === mood.name ? 'white' : 'var(--primary-color)',
                                    '&:hover': {
                                        backgroundColor: selectedMood === mood.name
                                            ? 'var(--primary-color)'
                                            : 'rgba(0, 100, 0, 0.1)',
                                    }
                                }}
                                startIcon={mood.icon}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                    <Typography variant="button">{mood.name}</Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: { xs: 'none', sm: 'block' },
                                            opacity: 0.8
                                        }}
                                    >
                                        {mood.description}
                                    </Typography>
                                </Box>
                            </Button>
                        ))}
                    </Box>
                </Box>

                {/* Blog Grid */}
                <Grid container spacing={4}>
                    {filteredBlogs.map((blog) => (
                        <Grid item xs={12} md={6} lg={4} key={blog.id}>
                            <StyledCard>
                                <CategoryChip
                                    icon={<LocalOfferIcon color='inherit' />}
                                    label={blog.category}
                                />
                                <CardMedia
                                    component="img"
                                    height="240"
                                    image={blog.imageUrl}
                                    alt={blog.title}
                                    sx={{
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        sx={{
                                            color: 'var(--primary-color)',
                                            fontWeight: 600,
                                            mb: 2
                                        }}
                                    >
                                        {blog.title}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                color: 'text.secondary'
                                            }}
                                        >
                                            <PersonIcon fontSize="small" />
                                            {blog.author}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                color: 'text.secondary'
                                            }}
                                        >
                                            <AccessTimeIcon fontSize="small" />
                                            {blog.readTime}
                                        </Typography>
                                    </Box>

                                    <Typography variant="body1" color="text.secondary" component='p'>
                                        {blog.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ p: 3, pt: 0 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AutoStoriesIcon />}
                                        fullWidth
                                        href={blog.blogUrl}
                                        target='blank'
                                        sx={{
                                            backgroundColor: 'var(--primary-color)',
                                            color: 'white',
                                            borderRadius: '20px',
                                            '&:hover': {
                                                backgroundColor: 'darkgreen',
                                            }
                                        }}
                                    >
                                        Read Now
                                    </Button>
                                </CardActions>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default ReadOnline;