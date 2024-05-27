import { createSlice } from "@reduxjs/toolkit";

const initialUserDetailsState = {
  byId: {},
  allIds: [],
};

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState: initialUserDetailsState,
  reducers: {
    setUserDetails(state, action) {
      const newUser = action.payload;
      // Merge new user details into existing state
      state.byId = newUser;
      // Check if the user ID already exists in allIds array
      if (!state.allIds.includes(newUser.id)) {
        // Push the new user ID into allIds array
        state.allIds.push(newUser.id);
      }
    },
  },
});

export const { setUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
