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

      // change payments and reviews fields to length of field
      // will retrieve these field separately as they are laaarge
      userListings.forEach((listing) => {
        listing.payments = listing.payments.length;
        listing.reviews = listing.reviews.length;

        // stores an array of id's for quick iteration if necessary
        if (!state.allIds.includes(listing.id)) {
          state.allIds.push(listing.id);
        }
      });
      state.byId = userListings;
    },
    addListing(state, action) {
      const listing = action.payload;
      // adjust subfields to array length
      listing.payments = listing.payments.length;
      listing.reviews = listing.reviews.length;
      // push new listing to front of existing listing array
      state.byId.unshift(listing);
      // push id of new listing to front of all id listings array
      if (!state.allIds.includes(listing.id)) {
        state.allIds.unshift(listing.id);
      }
    },
    updateListing(state, action) {
      const listing = action.payload;
      // find the index of the relevant listing to update
      const index = state.byId.findIndex((item) => item.id === listing.id);

      if (index !== -1) {
        state.byId[index] = {...state.byId[index], ...listing}
      }

      if (!state.allIds.includes(listing.id)) {
        state.allIds.unshift(listing.id);
      }
    }
  },
});

export const { setUserListings, addListing, updateListing } = listingsSlice.actions;
export default listingsSlice.reducer;
