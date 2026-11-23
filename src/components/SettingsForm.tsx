import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import { loadSettings } from "../api/features/settings/settingsSlice";
import { Accordion, AccordionDetails, AccordionSummary, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

const SettingsForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { eventsPerPage, timeZone } = useSelector(
        (state: RootState) => state.settings
    )

    useEffect(() => {
        dispatch(loadSettings());
    }, [dispatch]);

    return(
        <Accordion>
            <AccordionSummary
                id="display-settings-heading"
                aria-controls="display-settings-content"
                expandIcon={<span aria-hidden="true">▾</span>}
                >
                Display settings
            </AccordionSummary>
            
            <AccordionDetails>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <FormControl fullWidth>
                        <InputLabel id="events-per-page-label">Events per page</InputLabel>
                         <Select
                        labelId="events-per-page-label"
                        label="Events per page"
                        value={eventsPerPage}
                        readOnly
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="time-zone-label">Time zone</InputLabel>
                        <Select
                            labelId="time-zone-label"
                            label="Time zone"
                            value={timeZone}
                            readOnly
                        >
                            <MenuItem value="America/Bogota">Bogotá</MenuItem>
                            <MenuItem value="America/New_York">New York</MenuItem>
                            <MenuItem value="UTC">UTC</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </AccordionDetails>
        </Accordion>
    )
}

export default SettingsForm
