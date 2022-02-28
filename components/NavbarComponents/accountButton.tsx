import React from 'react'
import { RootContext, IRootContextType } from '../GlobalComponents/screenerLayoutWrapper'
import styles from "../../styles/screenerNavbar.module.scss"
import { errorMessageWithClick } from './../../library/alertWindows'
import { switchToRinkeby } from './../../library/web3methods'
import WrongNetworkIcon from "../../public/images/wrongNetwork.svg"
import BigNumber from 'bignumber.js'
import AccountInfoWindow from './accountInfoWindow'
import SelectWalletWindow from './selectWalletWindow'

declare let window: any

const AccountButton = (): React.ReactElement => {
    const [balance, setBalance] = React.useState<string>("")
    const [accountInfoWindowDisplayed, setAccountInfoWindowDisplayed] = React.useState<boolean>(false)
    const [selectWalletWindowDisplayed, setSelectWalletWindowDisplayed] = React.useState<boolean>(false)

    const rootContext: IRootContextType = React.useContext(RootContext)

    React.useEffect(() => {
        if (rootContext.state.web3 != null) {
            if (rootContext.state.account != null) {
                rootContext.state.web3.eth.getBalance(rootContext.state.account)
                    .then(balance => {
                        setBalance(balance)
                    })        
            }
        }
    }, [rootContext.state])

    const Result = () => {
        return (
            <>
                <Content />
    
                <AccountInfoWindow 
                    windowDisplayed={accountInfoWindowDisplayed} 
                    closeWindowListener={() => {setAccountInfoWindowDisplayed(false)}} 
                />
                
                <SelectWalletWindow 
                    windowDisplayed={selectWalletWindowDisplayed} 
                    closeWindowListener={() => {setSelectWalletWindowDisplayed(false)}} 
                />
            </>
        )
    }

    const Content = (): React.ReactElement => {
        if (rootContext.state.accounts != null && rootContext.state.account != null) {
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

                return (
                    <div 
                        onClick={() => {
                            setAccountInfoWindowDisplayed(true)
                        }} 
                        id={styles.connectWallet} 
                        className={styles.connectWalletWhite}
                    >
                        <div id={styles.balanceDiv}>
                            {new BigNumber(balance).div(new BigNumber('1000000000000000000')).toFixed(9).toString()} ETH
                        </div>

                        <div id={styles.addressDiv}>
                            {`${rootContext.state.account.substring(0, 6)}...${rootContext.state.account.substring(rootContext.state.account.length - 4, rootContext.state.account.length)}`}
                        </div>
                    </div>
                )
            }
        }

        return (
            <div 
                onClick={() => {
                    setSelectWalletWindowDisplayed(true)
            }} 
                id={styles.connectWallet} 
                className={styles.connectWalletWhite}
            >Connect to a wallet
            </div>
        )
    }

    return <Result />
}

export default AccountButton