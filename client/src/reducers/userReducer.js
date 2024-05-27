import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    currentUser: null,
    token: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginUser(state, action) {
            state.isLoggedIn = true;
            state.currentUser = action.payload.id;
            state.token = action.payload.token;
        },
        logoutUser(state) {
            state.isLoggedIn = false;
            state.currentUser = null;
            state.token = null;
        },
        registerUser(state, action) {
            state.isLoggedIn = true;
            state.currentUser = action.payload.id;
            state.token = action.payload.token;
        }
    }
});

export const { loginUser, logoutUser, registerUser } = userSlice.actions;
export default userSlice.reducer;