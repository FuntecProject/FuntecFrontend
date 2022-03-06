import React from "react"
import Web3 from "web3"
import contractsMetaData from '../../public/etc/contractsMetadata.json'
import Head from "next/head"
import Navbar from "../NavbarComponents/screenerNavbar"
import styles from "../../styles/screenerLayout.module.scss"
import { AbiItem } from 'web3-utils'
import { ApolloClient, InMemoryCache, ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import MetaData from '../../public/etc/metaData.json'
import { Contract } from "web3-eth-contract"

declare let window: any

interface IScreenerLayoutWrapperProps {
    title: string
    children: React.ReactElement
}

interface IWeb3ConnectionData {
    provider: any | null
    web3: Web3 | null
    account: string | null
    pollRewardsInstance: Contract | null
    accountsStorageInstance: Contract | null
}

interface IRootContextType {
    web3ConnectionData: IWeb3ConnectionData
    activePage: String | null
    setActivePage: (activePage: string) => void
    setWeb3AndAccountsInstance: (provider: any) => Promise<void>
}

let RootContext = React.createContext<IRootContextType>({} as IRootContextType)
let client = new ApolloClient({uri: MetaData.subgraphUrl, cache: new InMemoryCache()})

const ScreenerLayoutWrapper = (props: IScreenerLayoutWrapperProps): React.ReactElement => {
    const [activePage, setActivePage] = React.useState<String | null>(null)

    const initialState: IWeb3ConnectionData = {
        provider: null,
        web3: null,
        account: null,
        pollRewardsInstance: null,
        accountsStorageInstance: null
    }
    const [web3ConnectionData, setWeb3ConnectionData] = React.useState<IWeb3ConnectionData>(initialState)

    React.useEffect(() => {  
        if (window.ethereum) {
            setWeb3AndAccountsInstances(window.ethereum)
        }
    }, [])

    const setWeb3AndAccountsInstances = async (provider: any): Promise<void> => {
        let web3 = new Web3(provider)
        let accounts = await web3.eth.getAccounts()   

        if (accounts.length > 0) {
            setWeb3ConnectionData(prevState => ({
                ...prevState,
                provider: provider,
                web3: web3,
                account: accounts[0]
            }))
        }
    }

    React.useEffect(() => {
        if (web3ConnectionData.web3) {
            if (web3ConnectionData.provider.chainId == '0x4') {
                setContractsInstances()
            }

            web3ConnectionData.provider.on('chainChanged', handleChainChanged)
            web3ConnectionData.provider.on('accountsChanged', handleAccountChanged)
            web3ConnectionData.provider.on('disconnect', resetWeb3ConnectionData)
        }
    }, [web3ConnectionData.web3])

    const setContractsInstances = (): void => {
        if (web3ConnectionData.web3 != null) {
            let pollRewardsInstance = new web3ConnectionData.web3.eth.Contract(contractsMetaData.pollRewardsABI as AbiItem[], contractsMetaData.pollRewardsAddress)
            let accountsStorageInstace = new web3ConnectionData.web3.eth.Contract(contractsMetaData.accountsStorageABI as AbiItem[], contractsMetaData.accountsStorageAddress)
            
            setWeb3ConnectionData(prevState => ({
                ...prevState,
                pollRewardsInstance: pollRewardsInstance as unknown as Contract,
                accountsStorageInstance: accountsStorageInstace as unknown as Contract,
            }))
        }
    }

    const handleChainChanged = () => window.location.reload

    const handleAccountChanged = async () => {
        console.log('changed')
        let accounts = await web3ConnectionData.web3.eth.getAccounts()
        
        setWeb3ConnectionData(prevState => ({
            ...prevState,
            account: accounts[0]
        }))
    }

    const resetWeb3ConnectionData = () => setWeb3ConnectionData({...initialState})

    const rootContext: IRootContextType = {
        web3ConnectionData: web3ConnectionData,
        activePage: activePage,
        setActivePage: setActivePage,
        setWeb3AndAccountsInstance: setWeb3AndAccountsInstances
    }

    return (
        <ApolloProvider client={client}>
            <RootContext.Provider value={rootContext}>
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
            </RootContext.Provider>
        </ApolloProvider>
    )
}

export default ScreenerLayoutWrapper

export {
    RootContext
}

export type {
    IRootContextType
}
