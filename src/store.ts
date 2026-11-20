import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./api/features/events/eventsSlice";

export function createAppStore() {
    return configureStore({
        reducer: { events: eventsReducer }
    })
}

type AppStore = ReturnType<typeof createAppStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch'];
