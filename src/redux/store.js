import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./slice";

import layerIdReducer from "./LayerCountSlice";

const store = configureStore({
  reducer: {
    board: boardReducer,
    layerId: layerIdReducer,
  },
});

export default store;
