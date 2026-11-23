export interface Settings {
    eventsPerPage: number;
    timeZone: string;
}

export async function fetchSettings(): Promise<Settings> {
    const response = await fetch('/settings');

    if (!response.ok) {
        throw new Error(`Could not load settings. Status: ${response.status}`);
    }

    return response.json();
}

export async function saveSettings(settings: Settings): Promise<Settings> {
    const response = await fetch('/settings', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
    });

    if (!response.ok) {
        throw new Error(`Could not save settings. Status: ${response.status}`);
    }

    return response.json();
}