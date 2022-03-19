import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import Web3 from "web3"
import { Contract } from "web3-eth-contract"

interface Web3ConnectionDataState {
    provider: any | null
    web3: Web3 | null
    account: string | null
    pollRewardsInstance: Contract | null
    accountsStorageInstance: Contract | null
}

const initialState: Web3ConnectionDataState = {
    provider: null,
    web3: null,
    account: null,
    pollRewardsInstance: null,
    accountsStorageInstance: null
}

export const web3ConnectionDataSlice = createSlice({
    name: 'web3ConnectionData',
    initialState,
    reducers: {
        setWeb3ConnectionData: (state, action: PayloadAction<Web3ConnectionDataState>) => {
            state.provider = action.payload.provider
            state.web3 = action.payload.web3
            state.account = action.payload.account
            state.pollRewardsInstance = action.payload.pollRewardsInstance
            state.accountsStorageInstance = action.payload.accountsStorageInstance
        },

        setAccount: (state, action: PayloadAction<string>) => {
            state.account = action.payload
        },

        resetWeb3ConnectionData: state => {
            setWeb3ConnectionData(initialState)
        }
    }
})

export default web3ConnectionDataSlice.reducer

export const { 
    setWeb3ConnectionData: setWeb3ConnectionData, 
    setAccount: setAccount,
    resetWeb3ConnectionData: resetWeb3ConnectionData 
} = web3ConnectionDataSlice.actions
