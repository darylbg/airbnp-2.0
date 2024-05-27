import { createSlice } from "@reduxjs/toolkit";

const initialListingsState = {
  byId: {},
  allIds: [],
};

const listingsSlice = createSlice({
  name: "listings",
  initialState: initialListingsState,
  reducers: {
    setUserListings(state, action) {
      const userListings = action.payload;
      state.byId = userListings;

      userListings.map((listing) => {
        if(!state.allIds.includes(listing.id)) {
          state.allIds.push(listing.id);
        } 
      })
    },
  },
});

export const { setUserListings } = listingsSlice.actions;
export default listingsSlice.reducer;
