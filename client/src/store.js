import {
  configureStore,
  combineReducers,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./reducers/authReducer";
import userDetailsReducer from "./reducers/userDetailsReducer";
import userListingsReducer from "./reducers/userListingsReducer";
import allListingsReducer from "./reducers/allListingsReducer";
import bookingReducer from "./reducers/bookingReducer";
import chatBotReducer from "./reducers/chatBotReducer";
import reviewsReducer from "./reducers/reviewsReducer";

const persistConfig = {
    key: "root",
    storage,
}

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({
        auth: authReducer,
        userDetails: userDetailsReducer,
        userListings: userListingsReducer,
        allListings: allListingsReducer,
        bookingCycle: bookingReducer,
        chatBot: chatBotReducer,
        reviews: reviewsReducer
    }),
    
);

const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;