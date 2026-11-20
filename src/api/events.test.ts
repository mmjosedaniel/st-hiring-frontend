import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchEvents } from "./events";
import { jazzEvent } from "../test/fixtures/events";

describe("fetchEvents", () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })
    it("should request page 2 and respond the correct fields", async () => {
        const expectedEvent = jazzEvent;

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

    it("should throw an error when the API responds with Status Code 500", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            status: 500
        });

        vi.stubGlobal('fetch', fetchMock);

        await expect(fetchEvents(2, 5)).rejects.toThrow(
            "Could not load events. Status: 500"
        )

    })
})