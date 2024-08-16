import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  mapCenter: {
    coordinates: { lng: -1.9801, lat: 52.54851 },
  },
  userLocation: {
    coordinates: {
      lng: null,
      lat: null,
    },
    fullAddress: "",
  },
  booking: {
    currentStep: "",
    selectedListing: null,
    listingDetail: {
      listing: null,
      travel: null,
    },
    bookingDetails: {
      listing: null,
      numberOfPeople: 1,
      arrivalTime: {
        hour: "",
        minute: "",
      },
      specialRequests: "",
      pricing: {
        basePrice: 0.0,
        totalFees: 0.0,
        totalPromos: {
          name: "",
          discount: 0.0,
        },
        totalPrice: 0.0,
      },
    },
    checkoutInfo: {
      paymentMethod: null,
      checkoutSuccess: false,
    },
  },
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
    setMapCenter(state, action) {
      state.mapCenter = {
        ...state.mapCenter,
        coordinates: action.payload.coordinates
      };
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
      state.booking.currentStep = "bookingDetails";
      state.booking.bookingDetails = {
        ...state.booking.bookingDetails,
        ...action.payload,
      };
    },
    proceedToCheckout(state) {
      state.booking.currentStep = "checkout";
    },
    setCheckoutInfo(state, action) {
      state.booking.checkoutInfo = {
        ...state.booking.checkoutInfo,
        ...action.payload,
      };
    },
    resetBooking(state) {
        console.log("reset booking");
      state.booking = initialState.booking;
    },
    resetUserLocation(state) {
        console.log("reset user location");
      state.userLocation = initialState.userLocation;
    },
  },
});

export const {
  setLoading,
  setError,
  setMapCenter,
  setUserLocation,
  setCurrentStep,
  setSelectedListing,
  setListingDetails,
  setBookingDetails,
  proceedToCheckout,
  setCheckoutInfo,
  resetBooking,
  resetUserLocation,
} = bookingSlice.actions;

export default bookingSlice.reducer;
