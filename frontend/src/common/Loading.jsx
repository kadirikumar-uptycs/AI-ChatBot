import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/lottie/loading.json';
import Typography from '@mui/material/Typography';


const Loading = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '70%',
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '20%',
                }}
            />
            <Typography component="h1" fontSize="29px" marginLeft="30px" sx={{ color: 'darkgreen' }}>Loading...</Typography>
        </div>
    );
}

export default Loading;