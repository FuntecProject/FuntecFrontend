import React from "react"
import CrossIcon from "../../public/images/crossIcon.svg"
import styles from "../../styles/ComponentsStyles/NavbarComponentsStyles/selectWalletWindow.module.scss"
import Image from "next/dist/client/image"
import { errorMessageWithClick } from "./../../library/alertWindows"
import ScreenMouseLock from "../GlobalComponents/screenMouseLock"
import WalletConnectProvider from "@walletconnect/web3-provider"
import Web3 from "web3"
import { useMediaQuery } from 'react-responsive'
import { ScreenerLayoutWrapperContext, IScreenerLayoutWrapperContext} from "../GlobalComponents/screenerLayoutWrapper"

declare let window: any

interface ISelectWalletWindowProps {
    windowDisplayed: boolean
    closeWindowListener: () => void
}

const SelectWalletWindow = (props: ISelectWalletWindowProps): React.ReactElement | null => {
    const isMobile = useMediaQuery({ maxWidth: 1200})
    const screenerLayoutWrapperContext = React.useContext<IScreenerLayoutWrapperContext>(ScreenerLayoutWrapperContext)

    const Result = () => {
        return props.windowDisplayed ?
            <>
                <Content />

                <ScreenMouseLock 
                    backgroundShadowed={true}
                    removeDisplayedElement={props.closeWindowListener} 
                />
            </>
            :
            null
    }

    const Content = (): React.ReactElement => {
        return (
            <div id={styles.walletsIframeWindow}>
                <div id={styles.walletsIframeTitleAndSvg}>                
                    <h2>Choose a wallet:</h2>
                    <CrossIcon id={styles.closeWalletsIframe} onClick={props.closeWindowListener} />
                </div>
    
                <div id={styles.wallets}>
                    <WalletsList />
                </div>

                <div id={styles.footer}>
                    <div>New to ethereum?</div>
                    <a id={styles.learnMore} href="https://ethereum.org/en/wallets/" target="_blank" rel="noopener noreferrer">Learn more about wallets</a>
                </div>
            </div>
        )
    }

    const WalletsList = () => {
        return isMobile ?
            <ConnectUsingWalletConnectButton />
            :
            <>
                <ConnectUsingMetamaskButton />
                <ConnectUsingWalletConnectButton />
            </>
    }

    const ConnectUsingMetamaskButton = () => {
        return (
            <div id={styles.metamaskWallet} className={styles.walletElement} onClick={connectUsingMetamask}>
                <div className={styles.walletName}>Metamask</div>
                <Image src="/images/metamask.png" alt="Metamask wallet icon" width={32} height={32} />
            </div>
        )
    }

    const connectUsingMetamask = async () => {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            screenerLayoutWrapperContext.setWeb3AndAccountsInstances(window.ethereum)
        }

        else {
            errorMessageWithClick(
                <>
                    <div style={{fontFamily: 'Quicksand, sans-serif', fontSize: '20px'}}>
                        <div>You don't have metamask installed</div>
                        <div style={{paddingTop: '15px'}}>
                            Go to <a href="https://metamask.io/" target={'_blank'} rel="noopener noreferrer" style={{color: 'lightBlue'}}>metamask.io</a> to download it!
                        </div>
                    </div>
                </>
            )
        }
    }

    const ConnectUsingWalletConnectButton = () => {
        return (
            <div id={styles.walletConnectWallet} className={styles.walletElement} onClick={connectUsingWalletConnect}>
                <div className={styles.walletName}>WalletConnect</div>
                <Image src="/images/walletConnectIcon.svg" alt="WalletConnect wallet icon" width={32} height={32} />
            </div>
        )
    }

    const connectUsingWalletConnect = async () => {
        const provider = new WalletConnectProvider({infuraId: "338a91328e154a00be87b8075eb2925e"})
        const web3 = new Web3(provider as any)

        try {
            await provider.enable()
            let chainId = await web3.eth.getChainId()
            if (chainId == 4) {
                screenerLayoutWrapperContext.setWeb3AndAccountsInstances(provider)
            }
            else {
                provider.disconnect()
                errorMessageWithClick(<>The network provided is incorrect, try connecting with Rinkeby</>)
            }
        }
        catch(error) {
            console.log(error)
        }
    }

    return Result()
}

export default SelectWalletWindow
