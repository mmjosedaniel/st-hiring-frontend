import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchSettings, saveSettings } from './settings';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchSettings", () => {
    it("should request /settings and return the saved settings", async () => {
        const savedSettings = {
            eventsPerPage: 50,
            timeZone: 'America/New_York'
        };

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => savedSettings,
        });

        vi.stubGlobal('fetch', fetchMock);

        const result = await fetchSettings();

        expect(fetchMock).toHaveBeenCalledWith('/settings');
        expect(result).toEqual(savedSettings);
    })
})

describe("saveSettings", () => {
    it("should send the settings to POST /settings", async () => {
        const savedSettings = {
            eventsPerPage: 50,
            timeZone: 'America/New_York'
        };

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => savedSettings,
        });

        vi.stubGlobal('fetch', fetchMock);

        const result = await saveSettings(savedSettings);

        expect(fetchMock).toHaveBeenCalledWith(
            "/settings",
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(savedSettings),
            }
        )

        expect(result).toEqual(savedSettings);
    })
})

