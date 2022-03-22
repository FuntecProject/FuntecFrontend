import React from 'react'
import styles from "../../styles/ComponentsStyles/NavbarComponentsStyles/screenerNavbar.module.scss"
import { errorMessageWithClick } from '../../library/alertWindows'
import { switchToRinkeby } from '../../library/web3methods'
import WrongNetworkIcon from "/public/images/wrongNetwork.svg"
import AccountInfoWindow from './accountInfoWindow'
import SelectWalletWindow from './selectWalletWindow'
import { getAddressBalance } from '../../library/web3methods'
import { useAppSelector } from '../../app/hooks'
import AmountComponent from '../GlobalComponents/amountComponent'

const AccountButton = (): React.ReactElement => {
    const [accountInfoWindowDisplayed, setAccountInfoWindowDisplayed] = React.useState<boolean>(false)
    const [selectWalletWindowDisplayed, setSelectWalletWindowDisplayed] = React.useState<boolean>(false)
    const [balance, setBalance] = React.useState<string>("")

    const web3ConnectionData = useAppSelector(state => state.web3ConnectionData)

    React.useEffect(() => {
        if (web3ConnectionData.web3 != null) {
            getAddressBalance(web3ConnectionData.web3 ,web3ConnectionData.account)
                .then(balance => {
                    setBalance(balance)
                })
        }
    }, [web3ConnectionData])

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
        if (web3ConnectionData.account != null) {
            if (isCurrentChainRinkeby()) {
                return _AccountButton()
            }

            return WrongNetworkButton()
        }

        return ConnectWalletButton()
    }

    const isCurrentChainRinkeby = () => web3ConnectionData.accountsStorageInstance != null

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
                    {/* {new BigNumber(balance).div(new BigNumber('1000000000000000000')).toFixed(9).toString()} ETH */}
                    <AmountComponent amount={balance} />
                </div>

                <div id={styles.addressDiv}>
                    {`${web3ConnectionData.account.substring(0, 6)}...${web3ConnectionData.account.substring(web3ConnectionData.account.length - 4, web3ConnectionData.account.length)}`}
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
                            () => switchToRinkeby(web3ConnectionData.provider)
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
            >Connect to a wallet</div>
        )
    }

    return Result()
}

export default React.memo(AccountButton)