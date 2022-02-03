import React from "react"
import Web3 from "web3"
import contractsMetaData from '../public/etc/contractsMetadata.json'
import Head from "next/head"
import Navbar from "./screenerNavbar"
import MenuPanel from "./menuPanel"
import styles from "../styles/screenerLayout.module.scss"
import AccountInfoWindow from './accountInfoWindow'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { AbiItem } from 'web3-utils'
import ArbitrumNetworkWindow from './arbitrumNetworkWindow'
import SelectWalletWindow from './selectWalletWindow'
import { ApolloClient, InMemoryCache, ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import { getComponentName } from "../library/utils"
import MetaData from '../public/etc/metaData.json'
import { Contract } from "web3-eth-contract"

declare let window: any

let RootContext = React.createContext<IRootContextType>({} as IRootContextType)

interface IRootContextType {
    state: IScreenerLayoutWrapperState,
    methods: RootMethodsType
}

interface IScreenerLayoutWrapperState {
    providerNotInstalled: boolean
    wrongNetwork: boolean
    web3: Web3 | null
    accounts: string[] | null
    account: string | null
    pollRewardsInstance: Contract
    accountsStorageInstance: Contract
    backgroundShadowed: boolean
    menuDisplayed: boolean
    createWindowDisplayed: boolean
    accountInfoDisplayed: boolean
    arbitrumNetworkWindowDisplayed: boolean
    selectWalletWindowDisplayed: boolean
    activePage: string | null
    MySwal: typeof Swal
    client: ApolloClient<NormalizedCacheObject>
}

interface RootMethodsType {
    setAccountInfoDisplayed: () => void
    setMenuDisplayed: () => void
    setArbitrumNetworkWindowDisplayed: () => void
    setSelectWalletWindowDisplayed: () => void
    setAccounts: (accounts: string[]) => void
    removeDisplayedElement: () => void
    setActivePage: (activePage: string) => void
    setCreateWindowDisplayed: () => void
}

const client = new ApolloClient({
    uri: MetaData.subgraphUrl,
    cache: new InMemoryCache()
})

export default function ScreenerLayoutWrapper(props: {wrappedComponent: React.FunctionComponent}): React.ReactElement {
    const WrappedComponent = props.wrappedComponent

    const [state, setState] = React.useState<IScreenerLayoutWrapperState>({
        providerNotInstalled: false,
        wrongNetwork: false,
        web3: null,
        accounts: null,
        account: null,
        pollRewardsInstance: null,
        accountsStorageInstance: null,
        backgroundShadowed: false,
        menuDisplayed: false,
        createWindowDisplayed: false,
        accountInfoDisplayed: false,
        arbitrumNetworkWindowDisplayed: false,
        selectWalletWindowDisplayed: false,
        activePage: null,
        MySwal: withReactContent(Swal),
        client: client
    })

    React.useEffect(() => {  
        const callback = async () => {
            if (window.ethereum) {
                await setData()         

                window.ethereum.on('chainChanged', handleChainChanged)
                window.ethereum.on('accountsChanged', handleAccountChanged)   

                return () => {
                    window.ethereum.removeListener('chainChanged', handleChainChanged)
                    window.ethereum.removeListener('accountsChanged', handleAccountChanged)
                }
            }       

            else {
                setState(prevState => ({
                    ...prevState,
                    providerNotInstalled: true
                }))
            }
        }

        callback()
    }, [])

    const setData = async (): Promise<void> => {
        if (state.web3 == null) {
            let web3 = new Web3(window.ethereum)
            let accounts = await web3.eth.getAccounts()   

            setState(prevState => ({
                ...prevState,
                web3: web3,
                accounts: accounts,
                account: accounts[0],
            }))
        }
    }

    React.useEffect(() => {
        const callback = async () => {
            if (window.ethereum) {
                if (window.ethereum.chainId != null) {
                    // if (window.ethereum.chainId == '0x66eeb') {
                    //     await setContractsInstances()
                    // }   
                    if (window.ethereum.chainId == '0x4') {
                        await setContractsInstances()
                    }

                    else {
                        setState(prevState => ({
                            ...prevState,
                            wrongNetwork: true
                        }))
                    }  
                } 
            }
        }

        callback()
    }, [state.web3])

    const setContractsInstances = async (): Promise<void> => {
        if (state.web3 != null) {
            let pollRewardsInstance = new state.web3.eth.Contract(contractsMetaData.pollRewardsABI as AbiItem[], contractsMetaData.pollRewardsAddress)
            let accountsStorageInstace = new state.web3.eth.Contract(contractsMetaData.accountsStorageABI as AbiItem[], contractsMetaData.accountsStorageAddress)
            
            setState(prevState => ({
                ...prevState,
                pollRewardsInstance: pollRewardsInstance as unknown as Contract,
                accountsStorageInstance: accountsStorageInstace as unknown as Contract,
            }))
        }
    }

    const handleChainChanged = (): void => {
        window.location.reload()
    }

    const handleAccountChanged = (): void => {
        window.location.reload()
    }

    const setActivePage = (activePage: string): void => {
        setState(prevState => ({
            ...prevState,
            activePage: activePage
        }))
    }

    const setMenuDisplayed = (): void => {
        setState(prevState => ({
            ...prevState,
            menuDisplayed: true,
            backgroundShadowed: true
        }))
    }

    const setCreateWindowDisplayed = (): void => {
        setState(prevState => ({
            ...prevState,
            createWindowDisplayed: true,
            backgroundShadowed: true
        }))
    }

    const setAccountInfoDisplayed = (): void => {
        setState(prevState => ({
            ...prevState,
            accountInfoDisplayed: true,
            backgroundShadowed: true
        }))
    }

    const setArbitrumNetworkWindowDisplayed = (): void => {
        setState(prevState => ({
            ...prevState,
            arbitrumNetworkWindowDisplayed: true,
            backgroundShadowed: true
        }))
    }
    
    const setSelectWalletWindowDisplayed = (): void => {
        setState(prevState => ({
            ...prevState,
            selectWalletWindowDisplayed: true,
            backgroundShadowed: true
        }))
    }

    const setAccounts = (accounts: string[]): void => {
        setState(prevState => ({
            ...prevState,
            accounts: accounts, 
            account: accounts[0]
        }))
    }

    const removeDisplayedElement = (): void => {
        setState(prevState => ({
            ...prevState,
            backgroundShadowed: false,
            accountInfoDisplayed: false,
            arbitrumNetworkWindowDisplayed: false,
            menuDisplayed: false,
            createWindowDisplayed: false,
            selectWalletWindowDisplayed: false
        }))
    }

    const BackgroundShadowed = (): React.ReactElement | null => {
        if (state.backgroundShadowed) {
            if (state.menuDisplayed) {
                return <div onClick={removeDisplayedElement} id={styles.backgroundShadowed}></div>
            }

            return <div onClick={removeDisplayedElement} id={styles.backgroundShadowed} style={{backdropFilter: 'blur(10px)'}}></div>
        }

        return null
    }

    const methods: RootMethodsType = {
        setAccountInfoDisplayed: setAccountInfoDisplayed,
        setMenuDisplayed: setMenuDisplayed,
        setArbitrumNetworkWindowDisplayed: setArbitrumNetworkWindowDisplayed,
        setSelectWalletWindowDisplayed: setSelectWalletWindowDisplayed,
        setAccounts: setAccounts,
        removeDisplayedElement: removeDisplayedElement,
        setActivePage: setActivePage,
        setCreateWindowDisplayed: setCreateWindowDisplayed
    }

    const contextData: IRootContextType = {
        state: state,
        methods: methods
    }

    return (
        <>
            <ApolloProvider client={client}>
                <RootContext.Provider value={contextData}>
                    <Head>
                        <title>{getComponentName(props.wrappedComponent)}</title>
                        <link rel="icon" type="image/x-icon" href="/images/appIcon.svg"></link>
                    </Head> 

                    <div id={styles.body}>
                        <Navbar />    
                        
                        <main id={styles.main}>                    
                                <WrappedComponent />
                        </main> 
                        
                        <MenuPanel />
                        
                        <AccountInfoWindow />
                        
                        <ArbitrumNetworkWindow />

                        <SelectWalletWindow />
                    </div>  

                    <BackgroundShadowed />
                </RootContext.Provider>
            </ApolloProvider>
        </>
    )
}

export {
    RootContext
}

export type {
    IRootContextType
}
