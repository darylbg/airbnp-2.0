import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userReviews: {
        count: 0,
        value: 0,
        reviews: []
    },
    listingReviews: {
        count: 0,
        value: 0,
        reviews: []
    }
};

const reviewsSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        setUserReviews(state, action) {
            state.userReviews.count = action.payload.count;
            state.userReviews.value = action.payload.value;
            state.userReviews.reviews = action.payload.reviews;
        },
        setListingReviews(state, action) {
            console.log("payload", action.payload.count);
            state.listingReviews.count = action.payload.count;
            state.listingReviews.value = action.payload.value;
            state.listingReviews.reviews = action.payload.reviews;
        },
    }
});

export const {setUserReviews, setListingReviews} = reviewsSlice.actions;
export default reviewsSlice.reducer;