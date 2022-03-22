import React from "react"
import styles from "../../styles/ComponentsStyles/NavbarComponentsStyles/accountInfoWindow.module.scss"
import RedirectIcon from "../../../public/images/redirect.svg"
import CopyIcon from "../../../public/images/copy.svg"
import LockIcon from "../../../public/images/lockIcon.svg"
import CrossIcon from "../../../public/images/crossIcon.svg"
import ScreenMouseLock from "../GlobalComponents/screenMouseLock"
import { useAppSelector } from "../../app/hooks"

interface IAccountInfoWindowProps {
    windowDisplayed: boolean
    closeWindowListener: () => void
}

interface IAccountInfoWindowState {
    receiverId: string | null,
    oracleId: string | null
}

const AccountInfoWindow = (props: IAccountInfoWindowProps): React.ReactElement => {
    const [state, setState] = React.useState<IAccountInfoWindowState>({
        receiverId: null,
        oracleId: null
    })

    const web3ConnectionData = useAppSelector(state => state.web3ConnectionData)

    React.useEffect((): void => {
        const callback = async (): Promise<void> => {
            if (web3ConnectionData.pollRewardsInstance && web3ConnectionData.account) {
                let oracleIdPromise = web3ConnectionData.accountsStorageInstance.methods.addressToOracleId(web3ConnectionData.account).call()
                let receiverIdPromise = web3ConnectionData.accountsStorageInstance.methods.addressToReceiverId(web3ConnectionData.account).call()

                let oracleId = await oracleIdPromise
                let receiverId = await receiverIdPromise

                setState(prevState => ({
                    ...prevState,
                    receiverId: receiverId,
                    oracleId: oracleId
                }))
            }
        }

        callback()
    }, [web3ConnectionData])

    const Result = () => {
        return props.windowDisplayed ?
            <>
                <AccountInfoPannel />
    
                <ScreenMouseLock 
                    backgroundShadowed={true} 
                    removeDisplayedElement={props.closeWindowListener} 
                />
            </>
            :
            null
    }

    const AccountInfoPannel = (): React.ReactElement => {
        return (
            <div id={styles.accountInfoWindow}>
                <div id={styles.form}>
                    <div id={styles.titleAndClose}>
                        <h1 id={styles.title}>Account</h1>
                        <CrossIcon 
                            onClick={props.closeWindowListener} 
                            id={styles.closeAccountInfo}
                        />
                    </div>
        
                    <div id={styles.accountNumberTitle}>Connected with account:</div>
        
                    <div id={styles.account}>{`${web3ConnectionData.account.substring(0, 12)}...${web3ConnectionData.account.substring(web3ConnectionData.account.length - 12, web3ConnectionData.account.length)}`}</div>
        
                    <div id={styles.addressActions}>
                        <a id={styles.viewOnExplorer} className={styles.link} target="_blank">
                            <RedirectIcon />
                            <div>View on explorer</div>
                        </a>    
        
                        <a id={styles.copyAddress} className={styles.link}>
                            <div>Copy address</div>
                            <CopyIcon />
                        </a>
                    </div>   

                    <div id={styles.accountIdTitle}>Receiver ID:</div>
                    <div id={styles.accountId}>
                        <ReceiverId />
                    </div> 

        
                    <a id={styles.copyAccount} className={styles.link}>
                        <CopyIcon />
                        <div>Copy receiver ID</div>
                    </a>

                    <div id={styles.oracleIdTitle}>Oracle ID:</div>
                        <div id={styles.oracleId}>
                            <OracleId />
                        </div>
        
                    <div id={styles.oraclesActions}>
                        <a id={styles.copyOracle} className={styles.link}>
                            <CopyIcon />
                            <div>Copy oracle ID</div>
                        </a>
        
                        <a id={styles.alterOracleDisponibility} className={`${styles.link}`}>
                            <div id={styles.message}>Disable oracle</div>
                            <LockIcon />
                        </a>
                    </div>

                    <DisconnectButton />
                </div>
            </div>
        )
    }

    const DisconnectButton = () => {
        return web3ConnectionData.provider && web3ConnectionData.provider.isWalletConnect ?
            <div id={styles.disconnectButton} onClick={() => {
                web3ConnectionData.provider.disconnect()
                props.closeWindowListener()
            }}>Disconnect</div> 
            :
            null
    }

    const ReceiverId = (): React.ReactElement => {
        return state.receiverId ?
            <>#{state.receiverId}</>
            :
            <>Your account is not registered as a receiver yet</>  
    }

    const OracleId = (): React.ReactElement => {
        return state.oracleId ?
            <>#{state.oracleId}</>
            :
            <>Your account is not registered as an oracle yet</>
    }

    return Result()
}

export default AccountInfoWindow