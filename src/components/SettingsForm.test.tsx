import { describe, expect, it, vi } from "vitest";
import { fetchSettings } from "../api/settings";
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
})