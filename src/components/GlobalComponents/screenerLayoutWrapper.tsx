import React from "react"
import Web3 from "web3"
import contractsMetaData from '../../../public/etc/contractsMetadata.json'
import Head from "next/head"
import Navbar from "../NavbarComponents/screenerNavbar"
import styles from "../../styles/ComponentsStyles/GlobalComponentsStyles/screenerLayout.module.scss"
import { AbiItem } from 'web3-utils'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import MetaData from '../../../public/etc/metaData.json'
import { Contract } from "web3-eth-contract"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { resetWeb3ConnectionData, setAccount, setWeb3ConnectionData } from "../../features/web3ConnectionDataSlice"
import { getUsdPrice } from "../../library/utils"
import { setPrice } from "../../features/usdPriceSlide"

declare let window: any

interface IScreenerLayoutWrapperProps {
    title: string
    children: React.ReactElement
}

interface IScreenerLayoutWrapperContext {
    setWeb3AndAccountsInstances: (provider: any) => Promise<void>
}

let client = new ApolloClient({uri: MetaData.subgraphUrl, cache: new InMemoryCache()})
let ScreenerLayoutWrapperContext = React.createContext<IScreenerLayoutWrapperContext>({} as IScreenerLayoutWrapperContext)

const ScreenerLayoutWrapper = (props: IScreenerLayoutWrapperProps): React.ReactElement => {
    const web3ConnectionData = useAppSelector(state => state.web3ConnectionData)
    const dispatch = useAppDispatch()

    React.useEffect(() => {  
        getUsdPrice()
            .then(result => dispatch(setPrice(result)))

        if (window.ethereum) {
            setWeb3AndAccountsInstances(window.ethereum)
        }
    }, [])

    const setWeb3AndAccountsInstances = async (provider: any): Promise<void> => {
        let web3 = new Web3(provider)
        let accounts = await web3.eth.getAccounts()   
        let pollRewardsInstance: Contract = null
        let accountsStorageInstance: Contract = null

        if (accounts.length > 0) {
            if (provider.chainId == '0x4') {
                pollRewardsInstance = new web3.eth.Contract(contractsMetaData.pollRewardsABI as AbiItem[], contractsMetaData.pollRewardsAddress)
                accountsStorageInstance = new web3.eth.Contract(contractsMetaData.accountsStorageABI as AbiItem[], contractsMetaData.accountsStorageAddress)
            }

            provider.on('chainChanged', reloadSite)
            provider.on('accountsChanged', handleAccountChanged)

            if (provider.isWalletConnect) {
                provider.on('disconnect', handleDisconnect)
            }

            dispatch(setWeb3ConnectionData({
                provider: provider,
                web3: web3,
                account: accounts[0],
                pollRewardsInstance: pollRewardsInstance,
                accountsStorageInstance: accountsStorageInstance
            }))
        }
    }

    const reloadSite = () => window.location.reload()

    const handleAccountChanged = async (accounts: Array<string>) => {
        if (accounts.length > 0) {
            dispatch(setAccount(accounts[0]))
        }

        else {
            handleDisconnect()
        }
    }

    const handleDisconnect = () => dispatch(resetWeb3ConnectionData())

    return (
        <ScreenerLayoutWrapperContext.Provider value={{setWeb3AndAccountsInstances: setWeb3AndAccountsInstances}}>
            <ApolloProvider client={client}>
                <Head>
                    <title>{props.title}</title>
                    <link rel="icon" type="image/x-icon" href="/images/appIcon.svg"></link>
                </Head> 
                
                <main id={styles.body}>
                    <Navbar />    
                    
                    <div id={styles.main}>                    
                        {props.children}
                    </div>                         
                </main>  
            </ApolloProvider>
        </ScreenerLayoutWrapperContext.Provider>
    )
}

export default ScreenerLayoutWrapper

export { ScreenerLayoutWrapperContext }

export type { IScreenerLayoutWrapperContext }
