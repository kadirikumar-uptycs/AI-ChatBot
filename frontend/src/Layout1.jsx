import React, { useState, useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './components/SideBar';
import Header from './components/Header';
import './App.css';

const Layout1 = () => {

    const [sideBarOpen, setSideBarOpen] = useState(false);

    useLayoutEffect(() => {
        document.title = 'Therapy Bot';
    }, []);
    
    return (
        <div className='layout-container'>
            <SideBar onToggle={() => setSideBarOpen(value => !value)} />
            <div className={`main ${sideBarOpen ? '' : 'sideBarClosed'}`}>
                <Header />
                <div className="content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout1;