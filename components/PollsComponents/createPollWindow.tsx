import React from "react"
import styles from "./../../styles/createPoll.module.scss"
import CrossIcon from "./../../public/images/crossIcon.svg"
import { createPoll } from "../../library/web3methods"
import { convertDateToUnix } from "../../library/utils"
import { RootContext, IRootContextType } from '../GlobalComponents/screenerLayoutWrapper'
import { errorMessageWithoutClick } from '../../library/alertWindows'
import { toWei } from "web3-utils"
import ScreenMouseLock from "../GlobalComponents/screenMouseLock"

interface ICreatePollWindowProps {
    windowDisplayed: boolean
    closeWindow: () => void
}

const CreatePollWindow = (props: ICreatePollWindowProps): React.ReactElement => {
    const [receiverId, setReceiverId] = React.useState<number>(0)
    const [oracleId, setOracleId] = React.useState<number>(0)
    const [amountContributed, setAmountContributed] = React.useState<number>(0)
    const [dateLimit, setDateLimit] = React.useState<number>(0)
    const [requirement, setRequirement] = React.useState<string>("")

    const rootContext: IRootContextType = React.useContext(RootContext)
    let receiverIdRef = React.useRef() as any

    React.useEffect((): void => {
        if (props.windowDisplayed) {
            receiverIdRef.focus()
        }
    }, [props.windowDisplayed])

    const Result = () => {
        return (
            <>
                <div 
                    id={styles.createPollIFrame} 
                    style={
                        props.windowDisplayed ? 
                            {'display': 'initial'} 
                            : 
                            {'display': 'none'}
                    }
                >
                    <div id={styles.createPoll}>
                        <div id={styles.createPollTitleAndSvg}>
                            <h2 id={styles.createPollTitle}>Create poll:</h2>
                            <CrossIcon onClick={props.closeWindow} id={styles.closeCreatePoll} />
                        </div>
    
                        <div id={styles.form}>
                            <label htmlFor="receiverId">Receiver ID / ENS name:</label>
                            <input type="number" id={styles.receiverId} min="0" max="1000000" step="1" onChange={event => {
                                setReceiverId(Number(event.target.value))}} ref={input => {receiverIdRef = input}}/>
                            <label htmlFor="oracleId">Oracle ID / ENS name:</label>
                            <input type="number" id={styles.oracleId} min="0" max="1000000" step="1" onChange={event => {
                                setOracleId(Number(event.target.value))}} />
                            <label htmlFor="contribution">Amount contributed:</label>
                            <input type="number" id={styles.contribution} min="0.0001" max="10000.000000000000000000" step="0.0001" onChange={event => {
                                setAmountContributed(Number(toWei(event.target.value)))}}/>
                            <label htmlFor="dateLimit">Date limit:</label>
                            <input type="date" id={styles.dateLimit} onChange={event => {
                                setDateLimit(Number(convertDateToUnix(event.target.value)))}}/>
                            <label htmlFor="requirement">Requirement:</label>
                            <textarea id={styles.requirement} onChange={event => {
                                setRequirement(event.target.value)}}></textarea>
                        </div>
                    </div> 
    
                    <div id={styles.buttons}>
                        {/*TODO cancel button should clear the inputs*/}
                        <div id={styles.cancel} onClick={props.closeWindow}>Cancel</div>
                        <div id={styles.create} onClick={createPollListener}>Create</div>
                    </div>
                </div>
    
                {
                    props.windowDisplayed ?
                        <ScreenMouseLock backgroundShadowed={true} removeDisplayedElement={props.closeWindow}/>
                        :
                        null
                }
            </>
        )
    }

    const createPollListener = async (): Promise<void> => {
        if (rootContext.web3ConnectionData.account != null) {
            if (
                receiverId == 0 ||
                oracleId == 0 ||
                amountContributed == 0 ||
                dateLimit == 0 ||
                requirement == ""
            ) {
                errorMessageWithoutClick(<>All values must be filled"</>)
            }

            else {
                createPoll(rootContext, receiverId, oracleId, dateLimit, amountContributed, requirement)
            }
        }

        else {
            errorMessageWithoutClick(<>Wallet not connected</>)
        }
    }

    return Result()
}

export default CreatePollWindow
