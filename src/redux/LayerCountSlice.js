import { createSlice } from "@reduxjs/toolkit";

const layerIdSlice = createSlice({
  name: "layerId",
  initialState: { count: 0 },
  reducers: {
    setCount: (state, action) => {
      console.log("action", action);
      state.count = action.payload;
    },
  },
});

export const { setCount } = layerIdSlice.actions;
export default layerIdSlice.reducer;
