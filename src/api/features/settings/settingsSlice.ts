import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSettings, saveSettings, Settings } from "../../settings";

const initialState: Settings = {
    eventsPerPage: 10,
    timeZone: 'America/Bogota',
}

export const loadSettings = createAsyncThunk<
    Settings,
    void,
    Record<string, never>
>(
    'settings/loadSettings',
    () => fetchSettings()
);

export const updateSettings = createAsyncThunk<
    Settings,
    Settings,
    Record<string, never>
> (
    'settings/updateSettings',
    (settings) => saveSettings(settings)
)

const settingsSlice  = createSlice({
    name: 'settings',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(loadSettings.fulfilled, (state, action) =>{
            state.eventsPerPage = action.payload.eventsPerPage;
            state.timeZone = action.payload.timeZone;
        })

        builder.addCase(updateSettings.fulfilled, (state, action) =>{
            state.eventsPerPage = action.payload.eventsPerPage;
            state.timeZone = action.payload.timeZone;
        })
    }
})

const settingReducer = settingsSlice.reducer;

export default settingReducer;