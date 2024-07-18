import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    booking: {
        currentStep: "", // Start with no specific step
        selectedListing: null,
        listingDetail: null,
        bookingDetails: {
            numberOfPeople: 1,
            arrivalTime: null,
            specialRequests: ""
        },
        checkoutInfo: {
            paymentMethod: null,
            billingAddress: null
        }
    }
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setCurrentStep(state, action) {
            state.booking.currentStep = action.payload;
        },
        selectedListing(state, action) {
            state.booking.selectedListing = action.payload;
            state.booking.currentStep = "selectedListing";
        },
        setListingDetails(state, action) {
            state.booking.listingDetail = action.payload;
            state.booking.currentStep = "listingDetails";
        },
        updateBookingDetails(state, action) {
            state.booking.currentStep = "bookingDetails"
            state.booking.bookingDetails = {
                ...state.booking.bookingDetails,
                ...action.payload
            };
        },
        proceedToCheckout(state) {
            state.booking.currentStep = "checkout";
        },
        updateCheckoutInfo(state, action) {
            state.booking.checkoutInfo = {
                ...state.booking.checkoutInfo,
                ...action.payload
            };
        },
        resetBooking(state) {
            state.booking = initialState.booking;
        }
    }
});

export const {
    setLoading,
    setError,
    setCurrentStep,
    selectedListing,
    setListingDetails,
    updateBookingDetails,
    proceedToCheckout,
    updateCheckoutInfo,
    resetBooking
} = bookingSlice.actions;

export default bookingSlice.reducer;
