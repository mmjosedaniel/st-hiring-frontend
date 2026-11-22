import { describe, expect, it, vi } from "vitest";
import { jazzEvent } from "../test/fixtures/events";
import { render, within, screen, fireEvent } from "@testing-library/react";
import EventTicketsDialogTable from "./EventTicketsDialogTable";

describe("EventTicketsDialogTable.test.tsx", () => {
    it("should show ticket 11 on the next page and restore the first 10 on the previous page", () => {
        const event = {
            ...jazzEvent,
            availableTickets: Array.from({ length: 11 }, (_, index) => ({
                id: index + 1,
                type: 'general',
                price: 1000,
            })),
        };

        render(<EventTicketsDialogTable event={event} onClose={vi.fn()} />)

        const table = within(screen.getByRole('table', { name: 'Available tickets' }));

        expect(table.queryByRole('cell', { name: '11' })).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));

        expect(table.getByRole('cell', { name: '11' })).toBeVisible()
        expect(table.queryByRole('cell', { name: '10' })).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Go to previous page' }));
        expect(table.getByRole('cell', { name: '10' })).toBeVisible();
    })
})