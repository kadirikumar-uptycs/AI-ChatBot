import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import { marked } from 'marked';

const TypeWriter = ({ text, speed, scrollFunction, disableCopy, styles = {}, disableTypingEffect }) => {
    const [displayedText, setDisplayedText] = useState({ index: -1, text: disableTypingEffect ? text : '' });
    const [isTyping, setIsTyping] = useState(!Boolean(disableTypingEffect));
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const typeText = async (index) => {
            if (index < text.length) {
                if (index === 0)
                    setDisplayedText({
                        index: index,
                        text: text?.charAt(index),
                    })
                else
                    setDisplayedText((prev) => {
                        if (prev?.index !== index)
                            return {
                                index: index,
                                text: prev?.text + text?.charAt(index)
                            }
                        else return prev;
                    });
                await delay(speed);
                typeText(index + 1);
            } else {
                setIsTyping(false);
            }
        };
        if (!disableTypingEffect) {
            scrollFunction?.();
            typeText(0);
        }
        // eslint-disable-next-line
    }, [text, speed]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
        });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                }}
            >
                {!isTyping && !disableCopy &&
                    <Tooltip title={isCopied ? 'Copied!' : 'Copy Response'}>
                        <IconButton
                            onClick={handleCopy}
                            sx={{
                                position: 'absolute',
                                bottom: '-15px',
                                left: '-9px',
                                color: 'var(--primary-color)',
                            }}
                        >
                            <ContentCopyIcon sx={{
                                fontSize: '17px'
                            }} />
                        </IconButton>
                    </Tooltip>
                }
                <Box
                    sx={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        wordWrap: 'break-word',
                        ...styles
                    }}
                    dangerouslySetInnerHTML={{ __html: marked(displayedText?.text) }}
                />
                {isTyping && <span className="cursor"></span>}

                <style>{`
        .cursor {
          display: inline-block;
          width: 10px;
          background-color: #ffffff;
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
            </Box>
        </Box>
    );
};

export default TypeWriter;