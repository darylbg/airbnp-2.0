import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  defaultListings: {
    ids: [],
    entities: [],
  },
  loading: false,
  error: null,
};

const allListingsSlice = createSlice({
  name: "allListings",
  initialState: initialState,
  reducers: {
    setAllListings(state, action) {
      const allListings = action.payload;
      state.entities = allListings;
      
    },
    addListing(state, action) {

    },
    removeListing(state, action) {

    }
  }
});

export const {setAllListings, addListing, removeListing} = allListingsSlice.actions;
export default allListingsSlice.reducer;
