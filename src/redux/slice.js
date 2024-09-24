import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boards: [],
};

const slice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoards: (state, action) => {
      state.boards = action.payload;
    },
  },
});

const layerSlice = createSlice({
  name: "layer",
  initialState: {
    id: null,
  },
  reducers: {
    setLayerId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setLayerId } = layerSlice.actions;
export const { setBoards } = slice.actions;
export default slice.reducer;
