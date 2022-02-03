import React from 'react'
import CloseIcon from '../public/images/crossIcon.svg'
import ArbitrumIcon from '../public/images/arbitrum.svg'
import styles from '../styles/arbitrumNetworkWindow.module.scss'
import { RootContext, IRootContextType } from './screenerLayoutWrapper'
import { addArbitrumTesnetNetwork, switchToArbitrumTesnetNetwork } from '../library/web3methods'
import { successMessageWithoutClick } from '../library/alertWindows'

declare let window: any

export default function ArbitrumNetworkWindow(): React.ReactElement {
    const rootContext: IRootContextType = React.useContext(RootContext)

    return (
        rootContext.state.arbitrumNetworkWindowDisplayed ?
            <div id={styles.body}>
                <div id={styles.title}>
                    <div id={styles.titleInfo}>
                        <ArbitrumIcon id={styles.arbitrumIcon} />
                        <h4 id={styles.titleText}>We use Arbitrum network!</h4>
                    </div>

                    <CloseIcon id={styles.closeArbitrumIframe} onClick={rootContext.methods.removeDisplayedElement} />
                </div>

                <div id={styles.message}>
                    Funtec uses Arbitrum (an Ethereum layer2 network) to make 
                    transactions cheaper, if you've never used it 
                    you will have to add the network to your wallet
                    and deposit some funds on it
                </div>

                <div id={styles.buttons}>
                    <div id={styles.addArbitrum} className={styles.button} onClick={async () => {
                        if (window.ethereum.chainId != '0x66eeb') {
                            try {    
                                await switchToArbitrumTesnetNetwork(window.ethereum)
                            }
                            
                            catch (switchError) {
                                try {
                                    await addArbitrumTesnetNetwork(window.ethereum)
                                } 
                                
                                catch (addError) {
                                    console.log("There was an error adding arbitrum network")
                                }
                            }
                        }

                        else {
                            successMessageWithoutClick(rootContext.state.MySwal, <>You are already on Arbitrum !</>, 1500)
                        }
                    }}>Switch to Arbitrum</div>

                    <a href="https://bridge.arbitrum.io/" target="_blank" rel="noopener noreferrer" id={styles.arbitrumBridgeLink}>
                        <div id={styles.depositFunds} className={styles.button}>
                            Deposit funds
                            <sup id={styles.depositFundsArrow}>↗</sup>
                        </div>
                    </a>
                </div>

                <div id={styles.learnMore}>
                    <a id= {styles.learnMoreLink} href="https://developer.offchainlabs.com/docs/rollup_basics" target="_blank" rel="noopener noreferrer">Learn more about Arbitrum</a>
                </div>
            </div>
        :
            null
    )
}