import PanToolIcon from '@mui/icons-material/PanTool';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { Component } from 'react';

// Theme Styles
const TREND_REVERSE_COLOR = '#FFFFFF';
const PRIMARY_COLOR_1 = '#0c0048';

const styles = () =>
    createStyles({
        dialogContainer: {
            maxWidth: '100%',
            width: '100%',
        },
        dialogPaper: {
            maxWidth: 1000,
            width: '100%',
        },
        dialogTitle: {
            alignItems: 'center',
            color: TREND_REVERSE_COLOR,
            display: 'flex',
            fontSize: 32,
            justifyContent: 'center',
            padding: 20,
            fontWeight: 'bold',
        },
        dialogTitleIcon: {
            height: 32,
            marginRight: 10,
            width: 32,
        },
        dialogTitleContainer: {
            backgroundColor: PRIMARY_COLOR_1,
        },
        errorTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            margin: '20px 0',
        },
    });

const initialState = {
    error: null,
    errorInfo: null,
    hasError: false,
};

class ErrorBoundary extends Component {
    state = initialState;

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(
        error,
        errorInfo
    ) {
        this.setState({
            hasError: true,
            error,
            errorInfo,
        });
    }

    handleClose = () => this.setState(initialState);

    render() {
        const { hasError, error, errorInfo } = this.state;
        const { children, classes } = this.props;

        return hasError ? (
            <Dialog
                aria-describedby="error-handling-dialog"
                aria-labelledby="error-dialog"
                classes={{
                    root: classes.dialogContainer,
                    paper: classes.dialogPaper,
                }}
                disableEscapeKeyDown
                onClose={this.handleClose}
                open={hasError}
            >
                <DialogTitle classes={{ root: classes.dialogTitleContainer }}>
                    <Typography
                        classes={{
                            root: classes.dialogTitle,
                        }}
                    >
                        <PanToolIcon classes={{ root: classes.dialogTitleIcon }} />
                        Oops, You have some bad code somewhere!
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{
                    scrollbarWidth: 'thin'
                }}>
                    <Typography classes={{ root: classes.errorTitle }} component="p">
                        Error Thrown
                    </Typography>
                    <Typography component="p">{error?.toString()}</Typography>
                    <Typography classes={{ root: classes.errorTitle }} component="p">
                        Where the error occured
                    </Typography>
                    <Typography component="p">{errorInfo?.componentStack}</Typography>
                </DialogContent>
            </Dialog>
        ) : (
            children
        );
    }
}

export default withStyles(styles)(ErrorBoundary);