import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchEvents } from "./events";

describe("fetchEvents", () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })
    it("should request page 2 and respond the correct fields", async () => {
        const expectedEvent = {
            id: 1,
            name: 'jazz concert',
            date: '2026-12-05T19:00:00-05:00',
            location: 'Teatro Municipal',
            description: 'live concert of Jazz.',
        };

        const eventMock = {
            ...expectedEvent,
            created_at: '2026-11-01T15:00:00Z',
            updated_at: '2026-11-10T18:30:00Z',
            availableTickets: [],
        };

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [eventMock]
        })

        vi.stubGlobal('fetch', fetchMock);

        const result = await fetchEvents(2, 5);

        expect(fetchMock).toHaveBeenCalledWith('/events?page=2&pageSize=5');
        expect(result).toEqual([expectedEvent]);
    })

    it("should throw an error when the API responds with Status Code 500", () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            status: 500
        });

        vi.stubGlobal('fetch', fetchMock);

        expect(fetchEvents(2, 5)).rejects.toThrow(
            "Could not load events. Status: 500"
        )

    })
})