import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../app/store"

interface ActivePageState {
    value: String | null
}

const initialState: ActivePageState = {
    value: null
}

export const activePageSlide = createSlice({
    name: 'activePage',
    initialState,
    reducers: {
        setActivePage: (state, action: PayloadAction<String>) => {
            state.value = action.payload
        }
    }
})

export default activePageSlide.reducer

export const { setActivePage: setActivePage } = activePageSlide.actions
export const selectActivePage = (state: RootState) => state.activePage.value
