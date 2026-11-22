import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchEvents } from "../api/events";
import { jazzEvent } from "../test/fixtures/events";
import { Provider } from "react-redux";
import { createAppStore } from "../store";
import EventsListTable from "./EventsListTable";
import { fireEvent, render, screen, within } from "@testing-library/react";

beforeEach(() => {
    vi.mocked(fetchEvents).mockReset();
});

describe("EventsListTable", ()=> {
    vi.mock("../api/events", () => ({
        fetchEvents: vi.fn(),
    }));

    it("should load the first page and show the events table", async () => {
        vi.mocked(fetchEvents).mockResolvedValueOnce({ items: [jazzEvent], total: 1});

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

    const firstPage = Array.from({length: 10}, (_, index) => ({
        ...jazzEvent,
        id: index + 1,
        name: `Event ${index + 1}` 
    }));

    it("should load, show the second page, and disable'Next' when 'Next' Button is clicked", async () => {
        
        const secondPageEvent = [{ ...jazzEvent, id: 11, name: "Event 11" }];

        vi.mocked(fetchEvents)
            .mockResolvedValueOnce({ items: firstPage, total: 11})
            .mockResolvedValueOnce({ items: secondPageEvent, total: 11})

        render(
            <Provider store={createAppStore()}>
                <EventsListTable />
            </Provider>
        )

        await screen.findByRole("rowheader", {name: "Event 1"});

        const nextButton = screen.getByRole("button", { name: "Go to next page" });
        fireEvent.click(nextButton)

        expect(await screen.findByRole("rowheader", { name: "Event 11" })).toBeVisible()
        expect(fetchEvents).toHaveBeenCalledWith(2,10)
        expect(screen.queryByRole("rowheader", { name: "Event 1" })).not.toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Go to next page" })).toBeDisabled();
    })

    it("should disable Next when the first page contains all 10 events", async () => {
        
        vi.mocked(fetchEvents).mockResolvedValueOnce({
            items: firstPage,
            total: 10,
        });

        render(
            <Provider store={createAppStore()}>
                <EventsListTable />
            </Provider>
        )

        await screen.findByRole("rowheader", { name: "Event 1" });

        expect(fetchEvents).toHaveBeenCalledWith(1,10)
        expect(screen.getByRole("button", { name: "Go to next page" })).toBeDisabled();
        expect(screen.getAllByRole("rowheader")).toHaveLength(10);
    })
})
