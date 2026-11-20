import { describe, expect, it } from "vitest";
import { EventItem } from "../../events";
import { jazzEvent } from "../../../test/fixtures/events";
import eventsReducer, { loadEvents } from "./eventsSlice"

describe("eventsSlice", () => {
  it("should store the events when loading succeeds", () => {
    const events: EventItem[] = [jazzEvent];

    const action = loadEvents.fulfilled(events, 'request-1', {
        page: 2,
        pageSize: 5
    }) 

    const state = eventsReducer(undefined, action)

    expect(state.items).toEqual(events);
    expect(state.page).toBe(2)
    expect(state.pageSize).toBe(5)
  });
});