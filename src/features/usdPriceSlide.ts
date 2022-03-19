import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UsdPriceSlide {
    displayed: boolean
    price: number
}

const initialState: UsdPriceSlide = {
    displayed: true,
    price: null
}

export const usdPriceSlide = createSlice({
    name: 'usdPriceSlide',
    initialState,
    reducers: {
        changeDisplayed: state => {
            state.displayed = !state.displayed
        },

        setPrice: (state, action: PayloadAction<number>) => {
            state.price = action.payload
        }
    }
})

export default usdPriceSlide.reducer

export const {
    changeDisplayed: changeDisplayed,
    setPrice: setPrice
} = usdPriceSlide.actions