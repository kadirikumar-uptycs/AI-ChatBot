import React, { useState, useEffect } from 'react';
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
    Chip,
    IconButton,
    Dialog,
    DialogContent,
    Fade,
} from '@mui/material';
import { styled } from '@mui/system';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import JokeIcon from '@mui/icons-material/NavigationOutlined';
import DadJokeIcon from '@mui/icons-material/FamilyRestroom';
import OneLinerIcon from '@mui/icons-material/ShortText';
import CloseIcon from '@mui/icons-material/Close';

const jokes = [
    {
        id: 1,
        category: 'Puns',
        title: "Why can't a bicycle stand up by itself?",
        punchline: "It's two-tired."
    },
    {
        id: 2,
        category: 'Dad Jokes',
        title: "What do you call a fake noodle?",
        punchline: "An Impasta."
    },
    {
        id: 3,
        category: 'One-Liners',
        title: "What do you call a bear with no teeth?",
        punchline: "A gummy bear."
    },
    {
        id: 4,
        category: 'Puns',
        title: "Why did the tomato turn red?",
        punchline: "Because it saw the salad dressing!"
    },
    {
        id: 5,
        category: 'Dad Jokes',
        title: "What do you call a dog magician?",
        punchline: "A labracadabrador."
    },
    {
        id: 6,
        category: 'One-Liners',
        title: "Why can't a nose be 12 inches long?",
        punchline: "Because then it would be a foot."
    },
    {
        id: 7,
        category: 'Puns',
        title: "What do you call a fish wearing a bowtie?",
        punchline: "Sofishticated."
    },
    {
        id: 8,
        category: 'Dad Jokes',
        title: "What do you call a bear with no socks?",
        punchline: "Bare-foot."
    },
    {
        id: 9,
        category: 'One-Liners',
        title: "Why did the kid throw his clock out the window?",
        punchline: "Because he wanted to see time fly!"
    },
    {
        id: 10,
        category: 'Puns',
        title: "Why don't scientists trust atoms?",
        punchline: "Because they make up everything."
    }
];

const JokeCard = styled(Card)(() => ({
    position: 'relative',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '20px',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out !important',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
    },
}));

const JokesPage = () => {
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [openJoke, setOpenJoke] = useState(null);

    useEffect(() => {
        dispatch(setCurrentPage('Funny Jokes'));
    }, [dispatch]);

    const categories = [
        { name: 'All', icon: <EmojiEmotionsIcon /> },
        { name: 'Puns', icon: <JokeIcon /> },
        { name: 'Dad Jokes', icon: <DadJokeIcon /> },
        { name: 'One-Liners', icon: <OneLinerIcon /> },
    ];

    const filteredJokes = jokes.filter(joke =>
        selectedCategory === 'All' || joke.category === selectedCategory
    );

    return (
        <Box sx={{ minHeight: '100vh', position: 'relative', pb: 8 }}>
            <Container maxWidth="lg">
                {/* Joke Page Header */}
                <Box sx={{ textAlign: 'center', pt: 4, pb: 4 }}>
                    <EmojiEmotionsIcon sx={{ fontSize: 60, color: 'var(--primary-color)', mb: 3 }} />
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
                        Laugh Out Loud
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto', mb: 6 }}>
                        Enjoy a collection of hilarious jokes to brighten your day!
                    </Typography>

                    {/* Category Filters */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                        {categories.map((category) => (
                            <Button
                                key={category.name}
                                variant={selectedCategory === category.name ? 'contained' : 'outlined'}
                                startIcon={category.icon}
                                color='success'
                                onClick={() => setSelectedCategory(category.name)}
                                sx={{
                                    borderRadius: '25px',
                                    px: 3,
                                    py: 1,
                                    mb: 2,
                                    background: selectedCategory === category.name ? 'var(--primary-color)' : '',
                                }}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </Box>
                </Box>

                {/* Jokes Grid */}
                <Grid container spacing={4}>
                    {filteredJokes.map((joke, index) => (
                        <Grid item xs={12} sm={6} lg={4} key={joke.id}>
                            <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                                <JokeCard onClick={() => setOpenJoke(joke)}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Chip
                                            label={joke.category}
                                            icon={
                                                joke.category === 'Puns' ? <JokeIcon color='inherit' /> :
                                                    joke.category === 'Dad Jokes' ? <DadJokeIcon color='inherit' /> :
                                                        joke.category === 'One-Liners' ? <OneLinerIcon color='inherit' /> : null
                                            }
                                            sx={{
                                                bgcolor: 'rgb(0 100 0 / 72%)',
                                                color: '#fff',
                                                mb: 1,
                                            }}
                                        />
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                color: 'var(--primary-color)',
                                            }}
                                        >
                                            {joke.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {joke.punchline}
                                        </Typography>
                                    </CardContent>
                                </JokeCard>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>

                {/* Joke Dialog */}
                <Dialog
                    open={!!openJoke}
                    onClose={() => setOpenJoke(null)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '20px',
                            overflow: 'hidden',
                        }
                    }}
                >
                    <DialogContent sx={{ p: 4, position: 'relative' }}>
                        <IconButton
                            onClick={() => setOpenJoke(null)}
                            sx={{
                                position: 'absolute',
                                right: 16,
                                top: 16,
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        {openJoke && (
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--primary-color)', mb: 2 }}>
                                    {openJoke.title}
                                </Typography>
                                <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 3 }}>
                                    {openJoke.punchline}
                                </Typography>
                                <Chip
                                    label={openJoke.category}
                                    icon={
                                        openJoke.category === 'Puns' ? <JokeIcon color='inherit' /> :
                                            openJoke.category === 'Dad Jokes' ? <DadJokeIcon color='inherit' /> :
                                                openJoke.category === 'One-Liners' ? <OneLinerIcon color='inherit' /> : null
                                    }
                                    sx={{
                                        bgcolor: 'rgba(0,100,0,0.9)',
                                        color: '#fff',
                                        mb: 1,
                                    }}
                                />
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
            </Container>
        </Box>
    );
};

export default JokesPage;