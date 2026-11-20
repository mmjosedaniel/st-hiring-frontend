export interface EventItem {
    id: number;
    name: string;
    date: string;
    location: string | null;
    description: string;
}

export async function fetchEvents(page: number, pageSize: number): Promise<EventItem[]> {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize)
    })

    const response = await fetch(`/events?${params}`);

    if (!response.ok) {
        throw new Error (`Could not load events. Status: ${response.status}`);
    }

    const data: EventItem[] = await response.json();
    
    const events = data.map(({id, name, date, location, description}) => ({
        id,
        name,
        date,
        location,
        description
    })) 

    return events;
}
