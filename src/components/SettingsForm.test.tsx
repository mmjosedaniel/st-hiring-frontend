import { describe, expect, it, vi } from "vitest";
import { fetchSettings, saveSettings } from "../api/settings";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createAppStore } from "../store";
import SettingsForm from "./SettingsForm";

vi.mock("../api/settings");

describe("SettingForm", () => {
    it("should show the preferences when display settings is opened", async () => {
        vi.mocked(fetchSettings).mockResolvedValue({
            eventsPerPage: 25,
            timeZone: "UTC",
        });

        render(
            <Provider store={createAppStore()}>
                <SettingsForm />
            </Provider>
        )

        fireEvent.click(screen.getByRole("button", { name: /display settings/i }));

        await waitFor(() => {
            expect(screen.getByRole("combobox", { name: /events per page/i })).toHaveTextContent("25");

            expect(screen.getByRole("combobox", { name: /time zone/i })).toHaveTextContent("UTC");
        })
    })

    it("should save the new page size and keep the current time zone", async () => {
        const savedSettings = { eventsPerPage: 25, timeZone: "UTC" };
        const updatedSettings = { eventsPerPage: 50, timeZone: "UTC" };

        vi.mocked(fetchSettings).mockResolvedValue(savedSettings);
        vi.mocked(saveSettings).mockResolvedValue(updatedSettings);

        render(
            <Provider store={createAppStore()}>
            <SettingsForm />
            </Provider>
        );

        fireEvent.click(screen.getByRole("button", { name: /display settings/i }));

        const pageSizeSelect = screen.getByRole("combobox", {
            name: /events per page/i,
        });

        await waitFor(() => {
            expect(pageSizeSelect).toHaveTextContent("25");
        });

        fireEvent.mouseDown(pageSizeSelect);
        fireEvent.click(await screen.findByRole("option", { name: "50" }));
        fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

        await waitFor(() => {
            expect(saveSettings).toHaveBeenCalledWith(updatedSettings);
        });
    })
})