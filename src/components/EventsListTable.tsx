import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store"
import { useEffect } from "react";
import { loadEvents } from "../api/features/events/eventsSlice";
import { TableContainer, TableHead, TableRow, TableCell, TableBody, Table, TablePagination } from "@mui/material";

const dateFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Bogota',
});

const EventsListTable = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {items: events, page, pageSize, total} = useSelector((state: RootState) => state.events)

    useEffect(() => {
        dispatch(loadEvents({ page: 1, pageSize: 10 }))
    }, [dispatch])

    return(
        <TableContainer>
            <Table aria-label="Events Table">
                <TableHead>
                    <TableRow>
                        <TableCell scope="col">Event</TableCell>
                        <TableCell scope="col">Date</TableCell>
                        <TableCell scope="col">Location</TableCell>
                        <TableCell scope="col">Description</TableCell>
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
        </TableContainer>
    )
}

export default EventsListTable;
