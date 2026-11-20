import { Pagination } from "@mui/material";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EventItem, fetchEvents } from "../../events";

interface Pagination {
    page: number;
    pageSize: number;
}

interface EventState extends Pagination {
    items: EventItem[];
}

const initialState: EventState = {
    items: [],
    page: 1,
    pageSize: 10
} 

export const loadEvents = createAsyncThunk<
  EventItem[],
  Pagination,
  Record<string, never>
>(
    'events/loadEvents',
    ({ page, pageSize }: Pagination) => fetchEvents(page, pageSize)
)

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(loadEvents.fulfilled, (state, action) =>{
            const {page, pageSize} = action.meta.arg;

            state.items = action.payload;
            state.page = page;
            state.pageSize = pageSize
        })
    }
})

const eventsReducer = eventsSlice.reducer;
export default eventsReducer;
