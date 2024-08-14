import { createSlice } from "@reduxjs/toolkit";

const initialUserDetailsState = {
  byId: {},
  allIds: [],
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: initialUserDetailsState,
  reducers: {
    setUserDetails(state, action) {
      const user = action.payload;
      state.byId = {
        ...user,
        user_listings: user.user_listings.length,
        saved_listings: user.saved_listings.length,
        notifications: user.notifications.length,
        reviews: user.reviews.length,
        payments: user.payments.length,
        // booking_history: user.booking_history.length,
      };
      if (!state.allIds.includes(user.id)) {
        state.allIds.push(user.id);
      }
    },
    updateUserDetails(state, action) {
      try {
        const { userId, updates } = action.payload;
      if (state.byId.id === userId) {
        state.byId = {
          ...state.byId,
          ...updates,
        };
      }
      } catch (error) {
        console.log(error)
      }
      
    },
  },
});

export const { setUserDetails, updateUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
