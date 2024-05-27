import {
  configureStore,
  combineReducers,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./reducers/authReducer";
import userReducer from "./reducers/userReducer";
import userDetailsReducer from "./reducers/userDetailsReducer";

const persistConfig = {
    key: "root",
    storage,
}

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({
        // auth: authReducer,
        user: userReducer,
        userDetails: userDetailsReducer
    }),
    
);

const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;