import React from 'react';
import Avatar from '@mui/joy/Avatar';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Badge, { badgeClasses } from '@mui/joy/Badge';
import { useSelector } from 'react-redux';

const Header = () => {
    const loggedUser = useSelector(state => state.auth);
    const userName = loggedUser?.userInfo?.name || 'User';
    const profileImage = loggedUser?.profile || '';
    const currentPage = loggedUser?.currentPage;

    return (
        <div className='header'>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                paddingLeft={3}
                paddingRight={5}
                width="100%"
            >

                <Typography
                    fontFamily="Capriola"
                    component="h1"
                    fontWeight={400}
                    fontSize={21}
                    sx={{
                        color: 'var(--text-color)'
                    }}
                >
                    {currentPage}
                </Typography>

                <Stack
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                    spacing={3}
                >
                    <Typography
                        fontWeight={700}
                        fontSize={17}
                        fontFamily="Edu_AU_Variable"
                        component="h1"
                        sx={{
                            color: 'var(--primary-color)',
                            textShadow: '0 0 1px var(--primary-color), 0 0 3px var(--primary-color)'
                        }}
                    >{userName}</Typography>
                    <Badge
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeInset="14%"
                        color="success"
                        sx={{
                            [`& .${badgeClasses.badge}`]: {
                                '&::after': {
                                    position: 'absolute',
                                    top: -2,
                                    left: -2,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    animation: 'ripple 1.2s infinite ease-in-out',
                                    border: '2px solid',
                                    borderColor: 'success.500',
                                    content: '""',
                                },
                            },
                            '@keyframes ripple': {
                                '0%': {
                                    transform: 'scale(1)',
                                    opacity: 1,
                                },
                                '100%': {
                                    transform: 'scale(1.5)',
                                    opacity: 0,
                                },
                            },
                        }}
                    >

                        <Avatar
                            alt={userName}
                            src={profileImage}
                            slotProps={{ img: { referrerPolicy: 'no-referrer' } }}
                            sx={{
                                width: 40,
                                height: 40,
                                margin: '0 auto',
                                '&:hover': {
                                    border: '3px solid green',
                                }
                            }}
                        />
                    </Badge>
                </Stack>
            </Stack>
        </div>
    );
}

export default Header;