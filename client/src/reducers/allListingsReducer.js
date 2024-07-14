import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  defaultListings: {
    ids: [],
    entities: [],
  },
  loading: false,
  error: null,
  refetchListings: false
};

const allListingsSlice = createSlice({
  name: "allListings",
  initialState,
  reducers: {
    setAllListings(state, action) {
      const allListings = action.payload;
      state.defaultListings.ids = [];
      state.defaultListings.entities = [];

      allListings.forEach((listing) => {
        state.defaultListings.ids.push(listing.id);
        state.defaultListings.entities.push(listing);
      });
    },
    addToAllListings(state, action) {
      const listing = action.payload;
      if (!state.defaultListings.ids.includes(listing.id)) {
        state.defaultListings.ids.push(listing.id);
        state.defaultListings.entities.push(listing);
        state.refetchListings = true;
      }
    },
    removeFromAllListings(state, action) {
      try {
        const listingId = action.payload;
        state.defaultListings.ids = state.defaultListings.ids.filter(
          (id) => id !== listingId
        );
        state.defaultListings.entities = state.defaultListings.entities.filter(
          (listing) => listing.id !== listingId
        );
        state.refetchListings = true;
      } catch (error) {
        console.log(error);
      }
    },
    clearRefetchFlag(state) {
      state.refetchListings = false;
    }
  }
});

export const { setAllListings, addToAllListings, removeFromAllListings, clearRefetchFlag } = allListingsSlice.actions;
export default allListingsSlice.reducer;
