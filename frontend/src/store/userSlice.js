import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../config';

const initialState = {
    loading: false,
    users: [],
    error: '',
    noData: false,
    editUserId: '',
    deleteUserId: '',
};

const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
    const response = await axios.get(`${config.SERVER_BASE_ADDRESS}/user`, { withCredentials: true });
    return response.data;
});

const userSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        editUser: (state, action) => {
            state.editUserId = action.payload;
        },
        resetEditUserId: (state) => {
            state.editUserId = '';
        },
        deleteUser: (state, action) => {
            state.deleteUserId = action.payload;
        },
        resetDeleteUserId: (state) => {
            state.deleteUserId = '';
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchUsers.pending, state => {
            state.loading = true;
            state.noData = false;
        });
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
            if (Array.isArray(action.payload) && !action.payload.length) {
                state.noData = true;
            }
        });
        builder.addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.users = [];
            state.error = action.error?.message;
        });
    },
});

export default userSlice.reducer;
export const { editUser, resetEditUserId, deleteUser, resetDeleteUserId } = userSlice.actions;
export { fetchUsers };