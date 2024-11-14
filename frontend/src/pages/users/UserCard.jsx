import React from 'react';
import Avatar from '@mui/joy/Avatar';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import Tooltip from '@mui/joy/Tooltip';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import UserMenu from './UserMenu';
import { useSelector } from 'react-redux';

const UserCard = ({ id, ProfileImage, name, role, phone, email }) => {
    const loggedUser = useSelector(state => state.auth);
    const userInfo = loggedUser?.userInfo;
    const isAdmin = userInfo?.role === 'admin';
    return (
        <Card
            sx={{
                maxWidth: 250,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                position: 'relative',
                padding: 2,
                textAlign: 'center',
                backgroundColor: '#f4f9ff',
                borderRadius: '11px',
                maxHeight: '276px',
                background: '#e6e6e6b8'
            }}
        >
            <div style={{
                position: 'absolute',
                top: 8,
                right: 8,
                padding: 0
            }}>
                <UserMenu id={id} name={name} admin={isAdmin} />
            </div>

            {
                role === 'admin' && (
                    <div style={{
                        position: 'absolute',
                        top: 8,
                        left: 16,
                        padding: 0
                    }}>
                        <Tooltip title="Admin" color='success' arrow variant='plain'>
                            <AdminPanelSettingsIcon color='success' />
                        </Tooltip>
                    </div>
                )
            }

            <Avatar
                alt={name}
                src={ProfileImage}
                slotProps={{ img: { referrerPolicy: 'no-referrer' } }}
                sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto',
                    marginTop: 1
                }}
            />
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip
                    title={name}
                    arrow
                    color='success'
                    variant='solid'
                    placement='bottom'
                >
                    <Typography
                        level="h6"
                        component="div"
                        sx={{
                            marginTop: 2,
                            fontFamily: 'Poppins-ExtraBold',
                            color: 'var(--text-color)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%',
                        }}
                    >
                        {name}
                    </Typography>
                </Tooltip>

                <Typography
                    level="body2"
                    color="neutral"
                    component="div"
                    sx={{
                        marginTop: 1,
                        fontFamily: 'Poppins-SemiBold',
                        fontWeight: '900',
                        color: '#928fab'
                    }}
                >
                    {phone}
                </Typography>
                <Link
                    href={`mailto:${email}`}
                    color="success"
                    sx={{
                        fontSize: '17px',
                        textDecoration: 'none'
                    }}
                >
                    {email}
                </Link>
            </CardContent>
        </Card>
    );
};

export default UserCard;
