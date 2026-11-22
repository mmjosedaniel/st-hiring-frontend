export interface EventItem {
    id: number;
    name: string;
    date: string;
    location: string | null;
    description: string;
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
    
    const items = data.items.map(({id, name, date, location, description}) => ({
        id,
        name,
        date,
        location,
        description
    })) 

    return { items, total: data.total };
}
