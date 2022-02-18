import React from "react"
import styles from "../../styles/accountInfoWindow.module.scss"
import RedirectIcon from "../../public/images/redirect.svg"
import CopyIcon from "../../public/images/copy.svg"
import LockIcon from "../../public/images/lockIcon.svg"
import CrossIcon from "../../public/images/crossIcon.svg"
import { RootContext, IRootContextType } from '../Global components/screenerLayoutWrapper'
import ScreenMouseLock from "../Global components/screenMouseLock"

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

    const rootContext: IRootContextType = React.useContext(RootContext)

    React.useEffect((): void => {
        const callback = async (): Promise<void> => {
            if (rootContext.state.pollRewardsInstance && rootContext.state.account) {
                let oracleIdPromise = rootContext.state.accountsStorageInstance.methods.addressToOracleId(rootContext.state.account).call()
                let receiverIdPromise = rootContext.state.accountsStorageInstance.methods.addressToReceiverId(rootContext.state.account).call()

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
    }, [rootContext.state])

    const ReceiverId = (): React.ReactElement => {
        if (state.receiverId) {
            return <>#{state.receiverId}</>
        }

        else {
            return <>Your account is not registered as a receiver yet</>  
        }
    }

    const OracleId = (): React.ReactElement => {
        if (state.oracleId) {
            return <>#{state.oracleId}</>
        }

        else {
            return <>Your account is not registered as an oracle yet</>
        }
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
        
                    <div id={styles.account}>{`${rootContext.state.account.substring(0, 12)}...${rootContext.state.account.substring(rootContext.state.account.length - 12, rootContext.state.account.length)}`}</div>
        
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
                </div>
            </div>
        )
    }

    return (
        props.windowDisplayed ?
            <>
                <AccountInfoPannel />

                <ScreenMouseLock 
                    backgroundShadowed={true} 
                    removeDisplayedElement={props.closeWindowListener} 
                />
            </>
        :
            null
    )
}

export default AccountInfoWindow