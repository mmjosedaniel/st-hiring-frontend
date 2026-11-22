export interface TicketItem {
    id: number;
    type: string;
    price: number;
};

export interface EventItem {
    id: number;
    name: string;
    date: string;
    location: string | null;
    description: string;
    availableTickets: TicketItem[]
}

export interface EventsPage {
    items: EventItem[];
    total: number;
}

export async function fetchEvents(page: number, pageSize: number): Promise<EventsPage> {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize)
    })

    const response = await fetch(`/events?${params}`);

    if (!response.ok) {
        throw new Error (`Could not load events. Status: ${response.status}`);
    }

    const data: EventsPage = await response.json();
    
    const items = data.items.map((ticket) => ({
        id: ticket.id,
        name: ticket.name,
        date: ticket.date,
        location: ticket.location,
        description: ticket.description,
        availableTickets: ticket.availableTickets.map(ticket => ({
            id: ticket.id,
            type: ticket.type,
            price: ticket.price
        }))
    })) 

    return { items, total: data.total };
}
