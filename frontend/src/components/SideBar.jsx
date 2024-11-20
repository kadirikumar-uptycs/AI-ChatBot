import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import DrawIcon from '@mui/icons-material/Draw';
import HeadsetIcon from '@mui/icons-material/Headset';
import LanguageIcon from '@mui/icons-material/Language';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import CommentIcon from '@mui/icons-material/Comment';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CustomTooltip from '../common/CustomTooltip';
import assets from '../assets';
import { logout } from '../store/authSlice';
import { useSnackbar } from '../hooks/SnackBarProvider';
import ConfirmationSnackBar from '../common/ConfirmationSnackBar';
import axios from 'axios';
import config from '../config';
import './SideBar.css';


const SideBar = ({ onToggle }) => {

    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const openSnackBar = useSnackbar();
    const dispatch = useDispatch();

    const pages = [
        {
            name: 'Chat',
            tooltip: 'Chat with Therapy Bot',
            icon: CommentIcon,
            link: 'chat'
        },
        {
            name: 'Story Writing',
            tooltip: 'Write a Story',
            icon: DrawIcon,
            link: 'storyWriting'
        },
        {
            name: 'Listen Music',
            tooltip: 'Relax yourself with Music',
            icon: HeadsetIcon,
            link: 'music'
        },
        {
            name: 'Read Online',
            tooltip: 'Read something online',
            icon: LanguageIcon,
            link: 'readSuggestions',
        },
        {
            name: 'Yoga',
            tooltip: 'Do Yoga',
            icon: SelfImprovementIcon,
            link: 'yoga'
        },
        {
            name: 'Jokes',
            tooltip: 'Funny Jokes',
            icon: InsertEmoticonIcon,
            link: 'jokes',
        },
    ];


    const handleToggle = () => {
        setSideBarOpen(value => !value);
        onToggle();
    }

    const onLogoutResponse = async (wantLogout) => {
        setOpen(false);
        if (!wantLogout)
            return
        openSnackBar('Logging Out...');
        try {
            await axios.delete(`${config.SERVER_BASE_ADDRESS}/auth/logout`, { withCredentials: true });
            openSnackBar('Logged Out Successfully!', 'success');
            dispatch(logout());
            window.location.href = '/login';
        } catch (err) {
            console.log(err);
            openSnackBar('Error occurred while Logging Out, please try again', 'danger');
        }
    }

    return (
        <nav className={`sidebar ${sideBarOpen ? '' : 'close'}`}>
            <header>
                <div className="image-text">
                    <Link to='/' style={{
                        textDecoration: 'none'
                    }}>
                        <span className="image">
                            <img className="image" src={assets.robo} alt='' />
                        </span>
                    </Link>
                    <div className="text logo-text">
                        <span className="name">Therapy Bot</span>
                        <span className="college">UCO</span>
                    </div>
                </div>
                <ChevronRightOutlined className='toggle' onClick={handleToggle} />
            </header>
            <div className="menu-bar">
                <div className="menu">
                    <ul className="menu-links">
                        {pages.map((page, index) => (
                            <CustomTooltip key={index} title={!sideBarOpen && page.tooltip}>
                                <li className="nav-link">
                                    <Link to={page.link}>
                                        <page.icon className='mui--icon' />
                                        <span className="text nav-text">{page.name}</span>
                                    </Link>
                                </li>
                            </CustomTooltip>
                        ))}
                    </ul>
                </div>

                <div className="bottom-content">
                    <CustomTooltip title={!sideBarOpen && "Users"}>
                        <li className='nav-link'>
                            <Link to='users'>
                                <GroupRoundedIcon className='mui--icon' />
                                <span className="text nav-text">Users</span>
                            </Link>
                        </li>
                    </CustomTooltip>
                    <CustomTooltip title={!sideBarOpen && "User Requests"}>
                        <li className='nav-link'>
                            <Link to='UserRequests'>
                                <HowToRegIcon className='mui--icon' />
                                <span className="text nav-text">User Requests</span>
                            </Link>
                        </li>
                    </CustomTooltip>
                    <CustomTooltip title={!sideBarOpen && "Logout"}>
                        <li className='logout-btn' onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
                            <LogoutOutlinedIcon className='mui--icon' />
                            <span className="text nav-text">Logout</span>
                        </li>
                    </CustomTooltip>
                </div>
            </div>

            <ConfirmationSnackBar
                open={open}
                onClose={() => setOpen(false)}
                message='Do you want to Log out?'
                onResponse={onLogoutResponse}
            />
        </nav>
    );
}

export default SideBar;