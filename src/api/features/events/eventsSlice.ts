import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EventItem, EventsPage, fetchEvents } from "../../events";

interface Pagination {
    page: number;
    pageSize: number;
}

export interface EventState extends Pagination {
    items: EventItem[];
    total: number
}

const initialState: EventState = {
    items: [],
    page: 1,
    pageSize: 10,
    total: 0
} 

export const loadEvents = createAsyncThunk<
  EventsPage,
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
            const { items, total } = action.payload;
            const {page, pageSize} = action.meta.arg;

            state.items = items;
            state.page = page;
            state.pageSize = pageSize
            state.total = total;
        })
    }
})

const eventsReducer = eventsSlice.reducer;
export default eventsReducer;
