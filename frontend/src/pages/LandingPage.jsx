import React, { useLayoutEffect } from 'react';
import { Box, Button, Typography, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled, keyframes } from '@mui/system';
import DrawIcon from '@mui/icons-material/Draw';
import HeadsetIcon from '@mui/icons-material/Headset';
import LanguageIcon from '@mui/icons-material/Language';
import SpaIcon from '@mui/icons-material/Spa';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import assets from '../assets';
import { FcReddit } from "react-icons/fc";


const Card = styled(Box)(() => ({
    position: 'absolute',
    width: '300px',
    height: '200px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px 3px rgba(0, 0, 0, 0.05)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'all ease-in-out 0.2s',
}));

const Label = styled(Chip)(() => ({
    position: 'absolute',
    fontSize: '14px',
    width: 'fit-content',
    fontWeight: 'bold',
    color: '#333',
    padding: '8px',
    borderRadius: '12px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
    fontFamily: 'monospace'
}));

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const cardsData = [
    {
        label: 'Write your story',
        img: assets.write_a_story,
        icon: <DrawIcon />,
        bgColor: '#FFC1E3',
        position: {
            top: '10%',
            left: '10%'
        },
        labelPosition: {
            bottom: '-8%',
            right: '1%',
        },
        apiEndpoint: 'storyWriting'
    },

    {
        label: 'Relax yourself with Music',
        img: assets.listening_to_music,
        icon: <HeadsetIcon />,
        bgColor: '#C8BFE7',
        position: {
            top: '20%',
            right: '15%'
        },
        labelPosition: {
            bottom: '-8%',
            left: '-1%',
        },
        apiEndpoint: 'music'
    },

    {
        label: 'Read something online',
        img: assets.reading_book,
        icon: <LanguageIcon />,
        bgColor: '#A9D0F5',
        position: {
            bottom: '20%',
            left: '20%'
        },
        labelPosition: {
            bottom: '-8%',
            right: '-3%',
        },
        apiEndpoint: 'readSuggestions',
    },

    {
        label: 'Do Yoga',
        img: assets.yoga,
        icon: <SpaIcon />,
        bgColor: '#D5E8D4',
        position: {
            bottom: '10%',
            right: '8%'
        },
        labelPosition: {
            top: '-8%',
            right: '1%',
        },
        apiEndpoint: 'yoga'
    },

    {
        label: 'Funny Jokes',
        img: assets.funny_lemon,
        icon: <InsertEmoticonIcon />,
        bgColor: '#D5E8D4',
        position: {
            top: '0',
            right: '40%'
        },
        labelPosition: {
            bottom: '-8%',
            right: '30%',
        },
        apiEndpoint: 'jokes',
    },

];

const OnBoardingPage = () => {
    useLayoutEffect(() => {
        document.title = 'OnBoarding';
    }, []);
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                backgroundColor: '#fef7ed',
                minHeight: '100vh',
            }}
        >
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 'bold',
                    marginTop: '32px',
                    fontFamily: 'GreatVibes',
                    zIndex: 1,
                    textAlign: 'center',
                    fontSize: '3.5rem',
                    color: '#2C5E50',
                }}
            >
                Explore <br /> your <br /> Interests
            </Typography>

            {cardsData.map((card, index) => (
                <Link to={`/category/${card.apiEndpoint}`} key={index}>
                    <Card
                        sx={{
                            backgroundImage: `url(${card.img})`,
                            ...card.position,
                            '&:hover': {
                                scale: '1.03',
                                boxShadow: `0 0 9px 3px ${card.bgColor}`,
                            }
                        }}
                    >
                        <Label
                            icon={card.icon}
                            label={card.label}
                            sx={{
                                backgroundColor: card.bgColor,
                                ...card.labelPosition
                            }}
                        />
                    </Card>
                </Link>
            ))}
            <Link to='/category/chat' style={{ marginRight: '10%' }}>
                <Button
                    variant="contained"
                    sx={{
                        width: '200px',
                        fontSize: '16px',
                        fontFamily: 'Edu_AU_Variable',
                        padding: '12px',
                        borderRadius: '24px',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        position: 'absolute',
                        bottom: '32px',
                        marginBottom: '21px',
                        zIndex: 1,
                        backgroundColor: '#2C5E50',
                        color: '#fff',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        animation: `${pulseAnimation} 2s infinite`,
                        '&:hover': {
                            backgroundColor: '#1A4035',
                        },
                    }}
                >
                    <FcReddit style={{fontSize: '31px', marginRight: 2, marginBottom: 3}} />
                    Talk With Me
                </Button>
            </Link>
        </Box>
    );
};

export default OnBoardingPage;