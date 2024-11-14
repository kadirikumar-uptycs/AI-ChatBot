import React from 'react';
import Tooltip from '@mui/joy/Tooltip';

const CustomTooltip = ({ title, children }) => {
    return (
        <Tooltip
            title={title}
            color='primary'
            variant='outlined'
            placement="right"
            arrow
            sx={{
                color: 'var(--bg-color)',
                opacity: 0.7,
                background: 'var(--primary-color)',
            }}
        >
            {children}
        </Tooltip>
    );
}

export default CustomTooltip;