import React from 'react'
import { RootContext, IRootContextType } from './screenerLayoutWrapper'
import styles from "../styles/screenerNavbar.module.scss"
import { errorMessageWithClick } from '../library/alertWindows'
import { switchToRinkeby } from '../library/web3methods'
import WrongNetworkIcon from "../public/images/wrongNetwork.svg"
import BigNumber from 'bignumber.js'

declare let window: any

interface IAccountButtonState {
    balance: string
}

export default function AccountButton(): React.ReactElement {
    const [state, setState] = React.useState<IAccountButtonState>({
        balance: ""
    })

    const rootContext: IRootContextType = React.useContext(RootContext)

    React.useEffect(() => {
        const callback = async () => {
            if (rootContext.state.web3 != null) {
                if (rootContext.state.account != null) {
                    let balance = await rootContext.state.web3.eth.getBalance(rootContext.state.account)

                    setState(prevState => ({
                        ...prevState,
                        balance: balance
                    }))
                }
            }
        }

        callback()
    }, [rootContext.state])

    if (
        rootContext.state.accounts != null &&
        rootContext.state.account != null 
        ) {
        if (rootContext.state.accounts.length > 0) {
            if (rootContext.state.wrongNetwork ) {
                return (
                    <div 
                        id={styles.connectWallet} 
                        className={styles.connectWalletWrongNetwork} 
                        // onClick={():void => {rootContext.methods.setArbitrumNetworkWindowDisplayed()}}
                        onClick={() => {
                            errorMessageWithClick(
                                rootContext.state.MySwal,
                                <>You are using the wron network, click <a onClick={
                                    () => switchToRinkeby(window.ethereum)
                                } 
                                style={{color: 'lightBlue', cursor: 'pointer'}}>here</a> to change it</>
                            )
                        }}
                    >
                        <WrongNetworkIcon />
                        <div id={styles.wrongNetworkMessage}>Wrong network</div>
                    </div>
                )
            }

            else {
                return (
                    
                    <div 
                        onClick={() => {
                            rootContext.methods.setAccountInfoDisplayed()
                        }} 
                        id={styles.connectWallet} 
                        className={styles.connectWalletWhite}
                    >
                        <div id={styles.balanceDiv}>
                            {new BigNumber(state.balance).div(new BigNumber('1000000000000000000')).toFixed(9).toString()} ETH
                        </div>

                        <div id={styles.addressDiv}>
                            {`${rootContext.state.account.substring(0, 6)}...${rootContext.state.account.substring(rootContext.state.account.length - 4, rootContext.state.account.length)}`}
                        </div>
                    </div>
                )
            }
        }
    }

    return (
        <div 
            onClick={() => {
                rootContext.methods.setSelectWalletWindowDisplayed()
        }} 
            id={styles.connectWallet} 
            className={styles.connectWalletWhite}
        >Connect to a wallet
        </div>
    )
}