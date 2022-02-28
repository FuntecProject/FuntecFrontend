import React from "react"
import CrossIcon from "../../public/images/crossIcon.svg"
import { IRootContextType, RootContext } from '../GlobalComponents/screenerLayoutWrapper'
import styles from "../../styles/selectWalletWindow.module.scss"
import Image from "next/dist/client/image"
import { errorMessageWithClick } from "./../../library/alertWindows"
import ScreenMouseLock from "../GlobalComponents/screenMouseLock"

declare let window: any

interface ISelectWalletWindowProps {
    windowDisplayed: boolean
    closeWindowListener: () => void
}

const SelectWalletWindow = (props: ISelectWalletWindowProps): React.ReactElement | null => {
    const rootContext: IRootContextType = React.useContext(RootContext)

    const Result = () => {
        return (
            props.windowDisplayed ?
                <>
                    <Content />
    
                    <ScreenMouseLock 
                        backgroundShadowed={true}
                        removeDisplayedElement={props.closeWindowListener} 
                    />
                </>
                :
                null
        )
    }

    const Content = (): React.ReactElement => {
        const connectMetamask = async () => {
            if (window.ethereum) {
                let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                rootContext.methods.setAccounts(accounts)
            }

            else {
                errorMessageWithClick(rootContext.state.MySwal, 
                    <>
                        <div style={{fontFamily: 'Quicksand, sans-serif', fontSize: '20px'}}>
                            <div>You don't have metamask installed</div>
                            <div style={{paddingTop: '15px'}}>Go to <a href="https://metamask.io/" target={'_blank'} rel="noopener noreferrer" style={{color: 'lightBlue'}}>metamask.io</a> to download it!</div>
                        </div>
                    </>
                )
            }
        }

        return (
            <div id={styles.walletsIframeWindow}>
                <div id={styles.walletsIframeTitleAndSvg}>                
                    <h2>Choose a wallet:</h2>
                    <CrossIcon id={styles.closeWalletsIframe} onClick={props.closeWindowListener} />
                </div>
    
                <div id={styles.wallets}>
                    <div id={styles.metamaskWallet} className={styles.walletElement} onClick={async () => {
                        await connectMetamask()
                    }}>
                        <div className={styles.walletName}>Metamask</div>
                        <Image src="/images/metamask.png" alt="Metamask wallet icon" width={32} height={32} />
                    </div>

                    <div id={styles.walletConnectWallet} className={styles.walletElement} onClick={async () => {

                    }}>
                        <div className={styles.walletName}>WalletConnect</div>
                        <Image src="/images/walletConnectIcon.svg" alt="WalletConnect wallet icon" width={32} height={32} />
                    </div>
                </div>

                <div id={styles.footer}>
                    <div>New to ethereum?</div>
                    <a id={styles.learnMore} href="https://ethereum.org/en/wallets/" target="_blank" rel="noopener noreferrer">Learn more about wallets</a>
                </div>
            </div>
        )
    }

    return <Result />
}

export default SelectWalletWindow
