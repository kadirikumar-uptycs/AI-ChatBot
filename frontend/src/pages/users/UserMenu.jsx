import React, { useState } from 'react';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import MoreVert from '@mui/icons-material/MoreVert';
import Edit from '@mui/icons-material/Edit';
import DeleteForever from '@mui/icons-material/DeleteForever';
import MenuButton from '@mui/joy/MenuButton';
import Dropdown from '@mui/joy/Dropdown';
import { useDispatch } from 'react-redux';
import { editUser, deleteUser } from '../../store/userSlice';
import ConfirmationSnackBar from '../../common/ConfirmationSnackBar';



export default function UserMenu({ id, name, admin}) {
    const dispatch = useDispatch();
    let [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

    const handleOpen = () => setShowConfirmationMessage(true);
    const handleClose = () => setShowConfirmationMessage(false);

    const onResponse = (opinion) => {
        handleClose();
        if (opinion) {
            dispatch(deleteUser(id));
        }
    }

    return (
        <>
            <Dropdown>
                <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { color: 'neutral' } }}
                    disabled={!admin}
                >
                    <MoreVert/>
                </MenuButton>
                <Menu placement="bottom-start" sx={{
                    backgroundColor: '#f4f9ff',
                }}>
                    <MenuItem onClick={() => {
                        dispatch(editUser(id))
                    }}>
                        <ListItemDecorator>
                            <Edit />
                        </ListItemDecorator>{' '}
                        Edit
                    </MenuItem>
                    <MenuItem variant="soft" color="danger" onClick={handleOpen}>
                        <ListItemDecorator sx={{ color: 'inherit' }}>
                            <DeleteForever />
                        </ListItemDecorator>{' '}
                        Delete
                    </MenuItem>
                </Menu>
            </Dropdown>
            <ConfirmationSnackBar
                open={showConfirmationMessage}
                onClose={handleClose}
                message={<span>Are you sure to delete <strong>{name}</strong>?</span>}
                onResponse={onResponse}
            />
        </>
    );
}
