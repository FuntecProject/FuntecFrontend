import { configureStore } from "@reduxjs/toolkit"
import activePageReducer from "../features/activePageSlide"
import web3ConnectionDataReducer from "../features/web3ConnectionDataSlice"
import usdPriceReducer from "../features/usdPriceSlide"

const store = configureStore({
    reducer: {
        activePage: activePageReducer,
        web3ConnectionData: web3ConnectionDataReducer,
        usdPrice: usdPriceReducer
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch



