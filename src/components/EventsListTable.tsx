import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store"
import { useEffect, useState } from "react";
import { loadEvents } from "../api/features/events/eventsSlice";
import { TableContainer, TableHead, TableRow, TableCell, TableBody, Table, TablePagination, Button, Paper } from "@mui/material";
import { EventItem } from "../api/events";
import EventTicketsDialogTable from "./EventTicketsDialogTable";

const EventsListTable = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {items: events, page, pageSize, total} = useSelector((state: RootState) => state.events)
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

    const { eventsPerPage, timeZone } = useSelector(
        (state: RootState) => state.settings
    );

    const dateFormat = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone,
    });

    useEffect(() => {
        const request = dispatch(loadEvents({page: 1, pageSize: eventsPerPage}))

        return () => request.abort();
    }, [dispatch, eventsPerPage])

    return(
        <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
                mt: 2,
                bgcolor: "background.paper",
                borderColor: "#D4DEE6"
            }}
        >
            <Table aria-label="Events Table">
                <TableHead
                    sx={{
                        bgcolor: "#E8EEF3",
                        "& th": { fontWeight: 700 },
                    }}
                >
                    <TableRow>
                        <TableCell scope="col">Event</TableCell>
                        <TableCell scope="col">Date</TableCell>
                        <TableCell scope="col">Location</TableCell>
                        <TableCell scope="col"
                            sx={{ minWidth: { xs: "240px", sm: "auto" } }}
                        >
                                Description
                        </TableCell>
                        <TableCell scope="col">available tickets</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {events.map(event => (
                        <TableRow key={`event-${event.id}`}>
                            <TableCell component="th" scope="row">{event.name}</TableCell>
                            <TableCell>
                                <time dateTime={event.date}>
                                    {dateFormat.format(new Date(event.date))}
                                </time>
                            </TableCell>
                            <TableCell>{event.location ?? "Not defined"}</TableCell>
                            <TableCell >{event.description}</TableCell>
                            <TableCell >
                                {
                                    event.availableTickets.length > 0 ? (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            sx={{ whiteSpace: "nowrap", textTransform: "none" }}
                                            onClick={() => setSelectedEvent(event)}
                                        >
                                            Show Tickets ({event.availableTickets.length})
                                        </Button>
                                    ) : (
                                        "No available tickets"
                                    )
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination 
                component="div"
                count={total}
                page={page - 1}
                rowsPerPage={pageSize}
                rowsPerPageOptions={[pageSize]}
                labelDisplayedRows={() => `Page ${page}`}
                onPageChange={(_event, newPage) => {
                    dispatch(loadEvents({ page: newPage + 1, pageSize }));
                }}
            />

            {
                selectedEvent && (
                    <EventTicketsDialogTable
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                    />
                )
            }
        </TableContainer>
    )
}

export default EventsListTable;
