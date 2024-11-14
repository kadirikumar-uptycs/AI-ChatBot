import { Box } from '@mui/material';
import React from 'react';
import Typography from '@mui/material/Typography';

export const LoadingWave = ({ text }) => {
    const waveStyle = (index) => ({
        display: 'inline-block',
        animation: `wave 2s infinite`,
        animationDelay: `${0.1 * index}s`,
    });

    const keyframesStyle = `
    @keyframes wave {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-2px);
      }
    }
  `;

    return (
        <Box display="flex" justifyContent="center">
            <style>{keyframesStyle}</style>
            {text.split('').map((char, index) => (
                <Typography
                    variant="body2"
                    key={`${index + char}`}
                    style={waveStyle(index)}
                >
                    {char === ' ' ? '\u00A0' : char}
                </Typography>
            ))}
        </Box>
    );
};