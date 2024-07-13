import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  defaultListings: {
    ids: [],
    entities: {},
  },
  userListings: {
    ids: [],
    entities: {},
  },
  loading: false,
  error: null,
};
