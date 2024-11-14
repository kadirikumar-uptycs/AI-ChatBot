import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';
import songs from '../assets/songs/manifest.json';
import assets from '../assets';
import {
    Box,
    Container,
    Typography,
    IconButton,
    Slider,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
} from '@mui/material';
import Tooltip from '@mui/joy/Tooltip';
import { PlayArrow, Pause, SkipNext, SkipPrevious, Shuffle, Info } from '@mui/icons-material';

// Dynamic imports for audio and images
function importAll(r) {
    let assets = {};
    r.keys().forEach(key => { assets[key] = r(key); });
    return assets;
}

const songFiles = importAll(require.context('../assets/songs', false, /\.mp3$/));
const imageFiles = importAll(require.context('../assets/images', false, /\.(png|jpe?g)$/));


function ListenMusic() {
    const dispatch = useDispatch();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audio] = useState(new Audio());
    const [songsList, setSongsList] = useState(songs);


    useEffect(() => {
        dispatch(setCurrentPage('Relax with Music'));
        setCurrentSong(songs[0]);
        return () => {
            audio.pause();
            setIsPlaying(false);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);


    const getSongSrc = useCallback((fileName) => {
        const key = `./${fileName}`;
        return songFiles[key];
    }, []);

    const getImageSrc = useCallback((imageName) => {
        const key = `./${imageName}`;
        return imageFiles[key];
    }, []);

    useEffect(() => {
        if (currentSong) {
            const songSrc = getSongSrc(currentSong.fileName);

            if (audio.src !== songSrc) {
                audio.src = songSrc;
                audio.load();
            }

            // Set up event listeners
            const handleLoadedMetadata = () => setDuration(audio.duration);
            const handleTimeUpdate = () => setProgress(audio.currentTime);
            const handleEnded = () => {
                setIsPlaying(false);
                handleNextSong();
            };

            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('ended', handleEnded);

            // Clean up event listeners
            return () => {
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('ended', handleEnded);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSong, audio, getSongSrc]);

    useEffect(() => {
        if (isPlaying) {
            audio.play().catch(error => console.log('Playback error:', error));
        } else {
            audio.pause();
        }
    }, [isPlaying, audio, currentSong]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handlePlayPause = useCallback(() => {
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const handleProgressChange = useCallback((event, newValue) => {
        audio.currentTime = newValue;
        setProgress(newValue);
    }, [audio]);

    const handleSongSelect = useCallback((song) => {
        if (currentSong?.id === song.id) {
            setIsPlaying(!isPlaying);
        } else {
            setIsPlaying(false);
            setCurrentSong(song);
            setIsPlaying(true);
        }
    }, [currentSong, isPlaying]);

    const handleNextSong = useCallback(() => {
        const currentIndex = songsList.findIndex(song => song.id === currentSong?.id);
        const nextSong = songsList[(currentIndex + 1) % songsList.length];
        handleSongSelect(nextSong);
    }, [currentSong, handleSongSelect, songsList]);

    const handlePrevSong = useCallback(() => {
        const currentIndex = songsList.findIndex(song => song.id === currentSong?.id);
        const prevSong = songsList[(currentIndex - 1 + songsList.length) % songsList.length];
        handleSongSelect(prevSong);
    }, [currentSong, handleSongSelect, songsList]);

    const handleShuffle = useCallback(() => {
        const shuffledSongs = [...songsList];

        for (let i = shuffledSongs.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [shuffledSongs[i], shuffledSongs[randomIndex]] =
                [shuffledSongs[randomIndex], shuffledSongs[i]];
        }
        setSongsList(shuffledSongs);
    }, [songsList]);

    return (
        <Container maxWidth="xl" sx={{ display: 'flex', height: '100%' }}>
            {/* Player Left Section */}
            <Box
                sx={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 3,
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {currentSong?.imageName && (
                        <img
                            src={getImageSrc(currentSong.imageName)}
                            alt={currentSong.name}
                            loading="lazy"
                            style={{
                                width: '480px',
                                aspectRatio: '1.5/1',
                                borderRadius: '7px',
                                marginBottom: '9px',
                                boxShadow: 'rgb(170, 170, 170) 0px 5px 19px 5px',
                            }}
                        />
                    )}
                    <Typography variant="h4" color="success" sx={{ mb: 1, fontFamily: 'math' }}>
                        {currentSong?.name || 'Select a Song'}
                    </Typography>
                    <Typography variant="label" sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                        {currentSong?.movie || 'Unknown'}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        width: '100%',
                        mt: 2,
                    }}
                >
                    <Typography variant="body2">{formatTime(progress)}</Typography>
                    <Slider
                        value={progress}
                        onChange={handleProgressChange}
                        max={duration}
                        color="success"
                        sx={{
                            width: '70%',
                            '& .MuiSlider-thumb': {
                                width: 18,
                                height: 18,
                            },
                        }}
                    />
                    <Typography variant="body2">{formatTime(duration)}</Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        width: '50%',
                        mt: 2,
                    }}
                >
                    <Tooltip title='shuffle' arrow color='success' variant='outlined'>
                        <IconButton color="inherit" onClick={handleShuffle}>
                            <Shuffle />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Prev Song' arrow color='success' variant='outlined'>
                        <IconButton color="inherit" onClick={handlePrevSong}>
                            <SkipPrevious />
                        </IconButton>
                    </Tooltip>
                    <IconButton
                        onClick={handlePlayPause}
                        sx={{
                            backgroundColor: 'green',
                            color: '#fff',
                            borderRadius: '50%',
                            width: 60,
                            height: 60,
                            '&:hover': {
                                color: 'green',
                                background: '#f3f3f3',
                            },
                        }}
                    >
                        {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
                    </IconButton>
                    <Tooltip title='Next Song' arrow color='success' variant='outlined'>
                        <IconButton color="inherit" onClick={handleNextSong}>
                            <SkipNext />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Info' arrow color='success' variant='outlined'>
                        <IconButton color="inherit">
                            <Info />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Queue Right Section */}
            <Box
                sx={{
                    width: '50%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflowY: 'auto',
                    padding: 3,
                }}
            >
                <Typography variant="h4" sx={{ mb: 2, borderBottom: '3px outset yellow', fontFamily: 'Capriola', color: 'var(--primary-color)' }}>
                    Playlist
                </Typography>
                <List sx={{ width: '100%', maxHeight: '502px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                    {songsList.map((song) => (
                        <ListItem
                            key={song.id}
                            onClick={() => handleSongSelect(song)}
                            sx={{
                                cursor: 'pointer',
                                borderRadius: '7px',
                                boxShadow: '0 0 5px rgba(0, 0, 0, 0.07)',
                                marginBottom: '7px',
                                background: song.id === currentSong?.id ? 'rgba(0,100,0,0.15)' : 'transparent',
                                '&:hover': {
                                    background: song.id === currentSong?.id ? 'rgba(0,100,0,0.15)' : '#e5e9e5'
                                },
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    src={getImageSrc(song.imageName)}
                                    variant="rounded"
                                    sx={{ width: 50, height: 50 }}
                                    imgProps={{ loading: "lazy" }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={song.name}
                                secondary={song.movie}
                                primaryTypographyProps={{ color: 'darkgreen' }}
                                secondaryTypographyProps={{ fontSize: '0.875rem', opacity: 0.5 }}
                            />
                            {currentSong?.id === song?.id &&
                                <ListItemAvatar>
                                    <Avatar
                                        src={isPlaying ? assets.playingGif : assets.playingImage}
                                        variant="rounded"
                                        sx={{ width: 50, height: 50, filter: 'invert(1)' }}
                                        imgProps={{ loading: "lazy" }}
                                    />
                                </ListItemAvatar>
                            }
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container >
    );
}

export default ListenMusic;