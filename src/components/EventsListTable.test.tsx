import { describe, expect, it, vi } from "vitest";
import { fetchEvents } from "../api/events";
import { jazzEvent } from "../test/fixtures/events";
import { Provider } from "react-redux";
import { createAppStore } from "../store";
import EventsListTable from "./EventsListTable";
import { render, screen, within } from "@testing-library/react";

describe("EventsListTable", ()=> {
    vi.mock("../api/events", () => ({
        fetchEvents: vi.fn(),
    }));

    it("should load the first page and show the events table", async () => {
        vi.mocked(fetchEvents).mockResolvedValueOnce([jazzEvent]);

        render(
            <Provider store={createAppStore()}>
                <EventsListTable />
            </Provider>
        )

        const table = screen.getByRole("table", { name: "Events Table" });
        const row = await within(table).findByRole("row", { name: /jazz concert/i });
        const cells = within(row);

        expect(fetchEvents).toHaveBeenCalledWith(1, 10);
        expect(cells.getByRole("rowheader", { name: jazzEvent.name })).toBeVisible();
        expect(cells.getByRole("cell", { name: /Dec 5, 2026.*7:00 PM/i })).toBeVisible();
        expect(cells.getByRole("cell", { name: "Teatro Municipal" })).toBeVisible();
        expect(cells.getByRole("cell", { name: jazzEvent.description })).toBeVisible();
    })
})