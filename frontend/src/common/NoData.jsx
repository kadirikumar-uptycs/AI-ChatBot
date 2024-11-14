import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/lottie/no_data.json';

const NoData = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '500px',
                    height: '400px'
                }}
            />
        </div>
    );
}

export default NoData;