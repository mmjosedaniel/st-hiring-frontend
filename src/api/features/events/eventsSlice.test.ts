import { describe, expect, it } from "vitest";
import { jazzEvent } from "../../../test/fixtures/events";
import eventsReducer, { loadEvents } from "./eventsSlice"

describe("eventsSlice", () => {
  it("should store the events, total, and pagination when loading succeeds", () => {
    const response = {
      items: [jazzEvent],
      total: 6
    };

    const action = loadEvents.fulfilled(response, 'request-1', {
        page: 2,
        pageSize: 5
    }) 

    const state = eventsReducer(undefined, action)

    expect(state.items).toEqual(response.items);
    expect(state.total).toEqual(6);
    expect(state.page).toBe(2)
    expect(state.pageSize).toBe(5)
  });
});