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

    it("should show the available ticket count in the event row", async () => {
        const event = {
            ...jazzEvent,
            availableTickets: [
                { id: 42, type: 'general', price: 1000 },
                { id: 43, type: 'general', price: 1000 },
            ],
        }

        vi.mocked(fetchEvents).mockResolvedValueOnce({
            items: [event],
            total: 1,
        });

        render(
            <Provider store={createAppStore()}>
                <EventsListTable />
            </Provider>
        );

        const row = await screen.findByRole('row', { name: /jazz concert/i });
        const button = within(row).getByRole('button', { name: 'Show Tickets (2)' });

        expect(button).toBeVisible();
    })

    it("should open a dialog with the tickets for the selected event", async () => {
        const event = {
            ...jazzEvent,
            availableTickets: [
                { id: 42, type: 'general', price: 1000 },
                { id: 43, type: 'general', price: 1000 },
            ],
        }

        const rockEvent = {
            ...jazzEvent,
            id: 2,
            name: 'Rock concert',
            availableTickets: [
                { id: 99, type: 'general', price: 1500 },
            ],
        }

        vi.mocked(fetchEvents).mockResolvedValueOnce({
            items: [rockEvent, event],
            total: 2,
        });

        render(
            <Provider store={createAppStore()}>
                <EventsListTable />
            </Provider>
        );

        const jazzEventRow = await screen.findByRole('row', { name: /jazz concert/i });

        fireEvent.click(
            within(jazzEventRow).getByRole('button', { name: 'Show Tickets (2)' })
        );

        const dialog = await screen.findByRole('dialog', { name: /jazz concert/i });

        const ticketTable = within(dialog).getByRole('table');

        expect(within(ticketTable).getByText('42')).toBeVisible();
        expect(within(ticketTable).getByText('43')).toBeVisible();
        expect(within(ticketTable).queryByText('99')).not.toBeInTheDocument();
    })
})
