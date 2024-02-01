import { createSlice } from "@reduxjs/toolkit";

export const authReducer = createSlice({
  name: "Auth",
  initialState: {
    isLoggedIn: false,
    user: {
      token: "",
      id: "",
      first_name: "",
      last_name: "",
      display_name: "",
      gender: "",
      email: "",
      user_image: "",
      user_listings: [],
      saved_listings: [],
      notifications: [],
      reviews: [],
      payments: [],
      booking_history: [],
    },
  },
  reducers: {
    login_user(state, action) {
      return {
        ...state,
        isLoggedIn: true,
        user: {
          token: action.payload.token,
          id: action.payload.id,
          first_name: action.payload.first_name,
          last_name: action.payload.last_name,
          display_name: action.payload.display_name,
          gender: action.payload.gender,
          email: action.payload.email,
          user_image: action.payload.user_image,
          user_listings: action.payload.user_listings,
          saved_listings: action.payload.saved_listings,
          notifications: action.payload.notifications,
          reviews: action.payload.reviews,
          payments: action.payload.payments,
          booking_history: action.payload.booking_history,
        },
      };
    },
    logout_user(state, action) {
        return {
            ...state,
            isLoggedIn: false,
            user: {
                token: "",
                id: "",
                first_name: "",
                last_name: "",
                display_name: "",
                gender: "",
                email: "",
                user_image: "",
                user_listings: [],
                saved_listings: [],
                notifications: [],
                reviews: [],
                payments: [],
                booking_history: [],
            }
        };
    },
    register_user(state, action) {
        return {
            ...state,
            isLoggedIn: true,
            user: {
                token: action.payload.token,
                id: action.payload.id,
                first_name: action.payload.first_name,
                last_name: action.payload.last_name,
                display_name: action.payload.display_name,
                gender: action.payload.gender,
                email: action.payload.email,
                user_image: action.payload.user_image,
                user_listings: action.payload.user_listings,
                saved_listings: action.payload.saved_listings,
                notifications: action.payload.notifications,
                reviews: action.payload.reviews,
                payments: action.payload.payments,
                booking_history: action.payload.booking_history,
              },
        }
    }
  },
});

export const { login_user, logout_user, register_user } = authReducer.actions;
export default authReducer.reducer;
