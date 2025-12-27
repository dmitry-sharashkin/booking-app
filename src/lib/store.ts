// src/lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { bookingsApi } from "@/features/bookings/bookingsApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [bookingsApi.reducerPath]: bookingsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(bookingsApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
