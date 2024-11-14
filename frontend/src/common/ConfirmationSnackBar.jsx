import * as React from 'react';
import Snackbar from '@mui/joy/Snackbar';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

export default function ConfirmationSnackBar({ open, onClose, message, onResponse }) {

    return (
        <React.Fragment>
            <Snackbar
                variant="soft"
                color="danger"
                size="lg"
                invertedColors
                open={open}
                onClose={onClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    boxShadow: '0 0 70px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div>
                    <Typography level="title-lg" sx={{ color: '#010101' }}>Hey, Wait!!</Typography>
                    <Typography sx={{ mt: 1, mb: 2, }}>
                        {message}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Button variant="solid" color="warning" onClick={() => onResponse(true)}>
                            Yes
                        </Button>
                        <Button
                            variant="outlined"
                            color="success"
                            onClick={() => onResponse(false)}
                        >
                            No
                        </Button>
                    </Stack>
                </div>
            </Snackbar>
        </React.Fragment>
    );
}