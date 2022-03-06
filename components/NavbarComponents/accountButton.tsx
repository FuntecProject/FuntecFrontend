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
        if (rootContext.web3ConnectionData.web3 != null) {
            if (rootContext.web3ConnectionData.account != null) {
                rootContext.web3ConnectionData.web3.eth.getBalance(rootContext.web3ConnectionData.account)
                    .then(balance => {
                        setBalance(balance)
                    })        
            }
        }
    }, [rootContext.web3ConnectionData])

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
        if (rootContext.web3ConnectionData.account != null) {
            if (isCurrentChainRinkeby()) {
                return _AccountButton()
            }

            return WrongNetworkButton()
        }

        return ConnectWalletButton()
    }

    const isCurrentChainRinkeby = () => rootContext.web3ConnectionData.accountsStorageInstance != null

    const _AccountButton = () => {
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
                    {`${rootContext.web3ConnectionData.account.substring(0, 6)}...${rootContext.web3ConnectionData.account.substring(rootContext.web3ConnectionData.account.length - 4, rootContext.web3ConnectionData.account.length)}`}
                </div>
            </div>
        )
    }

    const WrongNetworkButton = () => {
        return (
            <div 
                id={styles.connectWallet} 
                className={styles.connectWalletWrongNetwork} 
                // onClick={rootContext.methods.setArbitrumNetworkWindowDisplayed}
                onClick={() => {
                    errorMessageWithClick(
                        <>You are using the wron network, click <a onClick={
                            () => switchToRinkeby(rootContext.web3ConnectionData.provider)
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

    const ConnectWalletButton = () => {
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

    return Result()
}

export default AccountButton