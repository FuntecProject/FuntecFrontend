import React from "react"
import Web3 from "web3"
import contractsMetaData from '../../public/etc/contractsMetadata.json'
import Head from "next/head"
import Navbar from "../NavbarComponents/screenerNavbar"
import styles from "../../styles/screenerLayout.module.scss"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { AbiItem } from 'web3-utils'
import { ApolloClient, InMemoryCache, ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import MetaData from '../../public/etc/metaData.json'
import { Contract } from "web3-eth-contract"

declare let window: any

interface IScreenerLayoutWrapperProps {
    title: string
    children: React.ReactElement
}

interface IScreenerLayoutWrapperState {
    providerNotInstalled: boolean
    wrongNetwork: boolean
    web3: Web3 | null
    accounts: string[] | null
    account: string | null
    pollRewardsInstance: Contract
    accountsStorageInstance: Contract
    activePage: string | null
    MySwal: typeof Swal
}

interface IRootContextType {
    state: IScreenerLayoutWrapperState,
    methods: RootMethodsType
}

interface RootMethodsType {
    setAccounts: (accounts: string[]) => void
    setActivePage: (activePage: string) => void
}

let RootContext = React.createContext<IRootContextType>({} as IRootContextType)

let client = new ApolloClient({uri: MetaData.subgraphUrl, cache: new InMemoryCache()})

const ScreenerLayoutWrapper = (props: IScreenerLayoutWrapperProps): React.ReactElement => {
    
    const [state, setState] = React.useState<IScreenerLayoutWrapperState>({
        providerNotInstalled: false,
        wrongNetwork: false,
        web3: null,
        accounts: null,
        account: null,
        pollRewardsInstance: null,
        accountsStorageInstance: null,
        activePage: null,
        MySwal: withReactContent(Swal),
    })

    React.useEffect(() => {  
        const setUpWeb3DataAndListeners = async () => {
            if (window.ethereum) {
                await setWeb3AndAccountsInstances()         

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

        setUpWeb3DataAndListeners()
    }, [])

    const handleChainChanged = (): void => {
        window.location.reload()
    }

    const handleAccountChanged = (): void => {
        window.location.reload()
    }

    React.useEffect(() => {
        if (window.ethereum) {
            if (window.ethereum.chainId != null) {
                if (window.ethereum.chainId == '0x4') {
                    setContractsInstances()
                }
                else {
                    setState(prevState => ({
                        ...prevState,
                        wrongNetwork: true
                    }))
                }  
            } 
        }
    }, [state.web3])

    const setWeb3AndAccountsInstances = async (): Promise<void> => {
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

    const setContractsInstances = (): void => {
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

    const setActivePage = (activePage: string): void => {
        setState(prevState => ({
            ...prevState,
            activePage: activePage
        }))
    }

    const setAccounts = (accounts: string[]): void => {
        setState(prevState => ({
            ...prevState,
            accounts: accounts, 
            account: accounts[0]
        }))
    }

    const methods: RootMethodsType = {
        setAccounts: setAccounts,
        setActivePage: setActivePage,
    }

    return (
        <>
            <ApolloProvider client={client}>
                <RootContext.Provider value={{state: state, methods: methods}}>
                    <Head>
                        <title>{props.title}</title>
                        <link rel="icon" type="image/x-icon" href="/images/appIcon.svg"></link>
                    </Head> 

                    <div id={styles.body}>
                        <Navbar />    
                        
                        <main id={styles.main}>                    
                            {props.children}
                        </main>                         
                    </div>  
                </RootContext.Provider>
            </ApolloProvider>
        </>
    )
}

export default ScreenerLayoutWrapper

export {
    RootContext
}

export type {
    IRootContextType
}
