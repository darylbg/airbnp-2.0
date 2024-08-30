import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userNotifications: {
        all: [],
        unread: [],
        read: [],
        archived: [],
        inbox: [],
        deletedAction: false,
        loading: false
    },
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications(state, action) {
            state.userNotifications.all = action.payload.all;
            state.userNotifications.unread = action.payload.unread;
            state.userNotifications.read = action.payload.read;
            state.userNotifications.archived = action.payload.archived;
            state.userNotifications.inbox = action.payload.inbox;
        },
    
    }
});

export const {setNotifications} = notificationsSlice.actions;
export default notificationsSlice.reducer;