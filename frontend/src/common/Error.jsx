import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/lottie/error.json';
import Typography from '@mui/joy/Typography';

const Error = ({ errors }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            height: '70%'
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '80%',
                    height: '80%'
                }}
            />
            <Typography color='danger' fontSize={15}>{errors}</Typography>
        </div>
    );
}

export default Error;