import { describe, expect, it, vi } from "vitest";
import { fetchSettings, saveSettings } from "../../settings";
import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, { loadSettings, updateSettings } from './settingsSlice';

vi.mock('../../settings');

describe("settingsSlice", () => {
    it("should store the settings returned by the API", async () => {
        const savedSettings = {
            eventsPerPage: 25,
            timeZone: 'UTC',
        };

        vi.mocked(fetchSettings).mockResolvedValue(savedSettings);

        const store = configureStore({
            reducer: { settings: settingsReducer },
        })

        await store.dispatch(loadSettings());
        expect(store.getState().settings).toMatchObject(savedSettings);
    })

    it("should save the requested settings and return the stored values", async () => {
        const requestedSettings = {
            eventsPerPage: 25,
            timeZone: 'UTC',
        };

        const savedSettings = {
            eventsPerPage: 50,
            timeZone: 'UTC',
        };

        vi.mocked(saveSettings).mockResolvedValue(savedSettings);

        const store = configureStore({
            reducer: { settings: settingsReducer },
        })

        await store.dispatch(updateSettings(requestedSettings));

        expect(saveSettings).toHaveBeenCalledWith(requestedSettings);
        expect(store.getState().settings).toMatchObject(savedSettings);
    }) 
})