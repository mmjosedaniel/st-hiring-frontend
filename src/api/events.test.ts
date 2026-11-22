import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchEvents } from "./events";
import { jazzEvent } from "../test/fixtures/events";

describe("fetchEvents", () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })
    it("should return the requested page of events and the total count", async () => {
        const eventMock = {
            ...jazzEvent,
            created_at: '2026-11-01T15:00:00Z',
            updated_at: '2026-11-10T18:30:00Z',
            availableTickets: [
                {
                    id: 42,
                    event_id: jazzEvent.id,
                    type: 'general',
                    status: 'available',
                    price: 1000,
                },
            ],
        };

        const expectedEvent = {
            ...jazzEvent,
            availableTickets: [
                { id: 42, type: 'general', price: 1000 },
        ],
    };

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                items: [eventMock],
                total: 6
            })
        })

        vi.stubGlobal('fetch', fetchMock);

        const result = await fetchEvents(2, 5);

        expect(fetchMock).toHaveBeenCalledWith('/events?page=2&pageSize=5');
        expect(result).toEqual({
            items: [expectedEvent],
            total: 6
        });
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