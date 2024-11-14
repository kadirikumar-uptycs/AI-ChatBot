import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    userInfo: {},
    currentPage: '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        login: (state, action) => {
            state.loggedIn = true;
            state.userInfo = action.payload;
        },
        logout: (state) => {
            state.loggedIn = false;
            state.userInfo = {};
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
    }
})


export default authSlice.reducer;
export const { login, logout, setCurrentPage } = authSlice.actions;