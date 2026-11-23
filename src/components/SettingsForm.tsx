import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import { loadSettings, updateSettings } from "../api/features/settings/settingsSlice";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import * as yup from 'yup';
import { useFormik } from "formik";
import { Settings } from "../api/settings";

const settingsSchema = yup.object({
    eventsPerPage: yup
        .number()
        .oneOf([10, 25, 50], 'Choose 10, 25, or 50 events per page.')
        .required('Choose the number of events per page.'),
    timeZone: yup
        .string()
        .oneOf(['America/Bogota', 'America/New_York', 'UTC'], 'Choose a valid time zone.')
        .required('Choose a time zone.')
})

const SettingsForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const settings = useSelector((state: RootState) => state.settings);

    useEffect(() => {
        dispatch(loadSettings());
    }, [dispatch]);

    const formik = useFormik<Settings>({
        initialValues: settings,
        enableReinitialize: true,
        validationSchema: settingsSchema,
        onSubmit: async (values, { resetForm, setStatus }) => {
            setStatus(undefined);

            try {
                const savedSettings = await dispatch(updateSettings(values)).unwrap();
                resetForm({ values: savedSettings });
            } catch {
                setStatus("Could not save settings. Please try again.");
            }
        }
    })

    const pageSizeError = formik.touched.eventsPerPage && formik.errors.eventsPerPage;
    const timeZoneError = formik.touched.timeZone && formik.errors.timeZone;

    return(
        <Accordion
            variant="outlined"
            sx={{ borderColor: "#D4DEE6" }}
        >
            <AccordionSummary
                id="display-settings-heading"
                aria-controls="display-settings-content"
                expandIcon={<span aria-hidden="true">▾</span>}
                >
                Display settings
            </AccordionSummary>
            
            <AccordionDetails>
                <form onSubmit={formik.handleSubmit}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <FormControl
                            size="small"
                            fullWidth error={Boolean(pageSizeError)}
                        >
                            <InputLabel id="events-per-page-label">Events per page</InputLabel>
                            <Select
                            labelId="events-per-page-label"
                            name="eventsPerPage"
                            label="Events per page"
                            value={formik.values.eventsPerPage}
                            onBlur={formik.handleBlur}
                            onChange={(event) => {
                                formik.setFieldValue("eventsPerPage", Number(event.target.value));
                            }}
                            >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>

                            {pageSizeError && <FormHelperText>{pageSizeError}</FormHelperText>}
                        </FormControl>

                        <FormControl
                            size="small"
                            fullWidth
                        >
                            <InputLabel id="time-zone-label">Time zone</InputLabel>
                            <Select
                                labelId="time-zone-label"
                                name="timeZone"
                                label="Time zone"
                                value={formik.values.timeZone}
                                onBlur={formik.handleBlur}
                                onChange={(event) => {
                                    formik.setFieldValue("timeZone", event.target.value);
                                }}
                            >
                                <MenuItem value="America/Bogota">Bogotá</MenuItem>
                                <MenuItem value="America/New_York">New York</MenuItem>
                                <MenuItem value="UTC">UTC</MenuItem>
                            </Select>
                            {timeZoneError && <FormHelperText>{timeZoneError}</FormHelperText>}
                        </FormControl>
                    </Stack>

                    {formik.status && <Alert severity="error">{formik.status}</Alert>}

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }} justifyContent="flex-end">
                        <Button
                            type="button"
                            disabled={formik.isSubmitting}
                            onClick={() => formik.resetForm()}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!formik.dirty || formik.isSubmitting}
                        >
                            Save changes
                        </Button>
                    </Stack>
                </form>
                
            </AccordionDetails>
        </Accordion>
    )
}

export default SettingsForm
