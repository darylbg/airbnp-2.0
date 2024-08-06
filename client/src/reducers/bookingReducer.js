import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    userLocation: {
        coordinates: {
            lng: null,
            lat: null
        },
        fullAddress: ""
    },
    booking: {
        currentStep: "", 
        selectedListing: null,
        listingDetail: {
            listing: null,
            travel: null
        },
        bookingDetails: {
            listing: null,
            numberOfPeople: 1,
            arrivalTime: null,
            specialRequests: "",
            price: null
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
        setUserLocation(state, action) {
            state.userLocation = {
                ...state.userLocation,
                coordinates: action.payload.coordinates,
                fullAddress: action.payload.fullAddress,
              };
        },
        setCurrentStep(state, action) {
            state.booking.currentStep = action.payload;
        },
        setSelectedListing(state, action) {
            state.booking.selectedListing = action.payload;
            state.booking.currentStep = "selectedListing";
        },
        setListingDetails(state, action) {
            state.booking.listingDetail = action.payload;
            state.booking.currentStep = "listingDetails";
        },
        setBookingDetails(state, action) {
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
        },
        resetUserLocation(state) {
            state.userLocation = initialState.userLocation;
        }
    }
});

export const {
    setLoading,
    setError,
    setUserLocation,
    setCurrentStep,
    setSelectedListing,
    setListingDetails,
    setBookingDetails,
    proceedToCheckout,
    updateCheckoutInfo,
    resetBooking,
    resetUserLocation
} = bookingSlice.actions;

export default bookingSlice.reducer;
