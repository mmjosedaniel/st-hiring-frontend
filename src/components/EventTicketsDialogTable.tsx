import { TableContainer, TableHead, TableRow, TableCell, TableBody, Table, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { EventItem } from "../api/events";
import { useState } from "react";

interface EventTicketsDialogTableProps {
    event: EventItem;
    onClose: () => void;
}

const ticketsPerPage = 10;

const EventTicketsDialogTable = ({ event, onClose }: EventTicketsDialogTableProps) => {
    const [page, setPage] = useState(0);
    const start = page * ticketsPerPage;
    const visibleTickets = event.availableTickets.slice(start, start + ticketsPerPage);

    return(
        <Dialog
            open
            onClose={onClose}
            aria-labelledby="event-tickets-title"
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle id="event-tickets-title">
                Tickets for {event.name}
            </DialogTitle>

            <DialogContent>
                <TableContainer>
                    <Table size="small" aria-label="Available tickets">
                        <TableHead
                            sx={{
                                bgcolor: "#E8EEF3",
                                "& th": { fontWeight: 700 },
                            }}
                        >
                            <TableRow>
                                <TableCell scope="col">Ticket ID</TableCell>
                                <TableCell scope="col">Type</TableCell>
                                <TableCell scope="col">Price</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {visibleTickets.map(ticket => (
                                <TableRow key={`ticket-${ticket.id}`}>
                                    <TableCell>{ticket.id}</TableCell>
                                    <TableCell>{ticket.type}</TableCell>
                                    <TableCell>{ticket.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={event.availableTickets.length}
                        page={page}
                        rowsPerPage={ticketsPerPage}
                        rowsPerPageOptions={[ticketsPerPage]}
                        labelDisplayedRows={() => `Page ${page + 1}`}
                        onPageChange={(_event, newPage) => {
                           setPage(newPage);
                        }}
                    />
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>

    )
}

export default EventTicketsDialogTable;
