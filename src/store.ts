import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./api/features/events/eventsSlice";
import settingReducer from "./api/features/settings/settingsSlice";

export function createAppStore() {
    return configureStore({
        reducer: {
            events: eventsReducer,
            settings: settingReducer
        }
    })
}

type AppStore = ReturnType<typeof createAppStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch'];
