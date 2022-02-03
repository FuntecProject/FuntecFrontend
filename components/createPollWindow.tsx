import React from "react"
import styles from "../styles/createPoll.module.scss"
import CrossIcon from "../public/images/crossIcon.svg"
import { createPoll } from "../library/web3methods"
import { convertDateToUnix } from "../library/utils"
import { RootContext, IRootContextType } from './screenerLayoutWrapper'
import { errorMessageWithoutClick } from '../library/alertWindows'
import { toWei } from "web3-utils"

interface ICreatePollWindowState {
    display: 'none' | 'initial',
    receiverId: number,
    oracleId: number,
    amountContributed: number,
    dateLimit: number,
    requirement: string 
}

export default function CreatePollWindow(): React.ReactElement {
    const [state, setState] = React.useState<ICreatePollWindowState>({
        display: 'none',
        receiverId: 0,
        oracleId: 0,
        amountContributed: 0,
        dateLimit: 0,
        requirement: ""
    })

    const rootContext: IRootContextType = React.useContext(RootContext)

    let receiverId = React.useRef() as any

    React.useEffect((): void => {
        if (state.display == 'initial') {
            receiverId.focus()
        }
    }, [state.display])

    React.useEffect((): void => {
        if (rootContext.state.createWindowDisplayed) {
            setState(prevState => ({
                ...prevState,
                display: 'initial'
            }))
        }

        else {
            setState(prevState => ({
                ...prevState, 
                display: 'none'
            }))
        }
    }, [rootContext.state.createWindowDisplayed])

    const createPollListener = async (): Promise<void> => {
        if (
            rootContext.state.account != null
        ) {
            if (
                state.receiverId == 0 ||
                state.oracleId == 0 ||
                state.amountContributed == 0 ||
                state.dateLimit == 0 ||
                state.requirement == ""
            ) {
                errorMessageWithoutClick(rootContext.state.MySwal, <>All values must be filled"</>)
            }

            else {
                await createPoll(
                    rootContext,
                    state.receiverId,
                    state.oracleId,
                    state.dateLimit,
                    state.amountContributed,
                    state.requirement
                )
            }
        }

        else {
            errorMessageWithoutClick(rootContext.state.MySwal, <>Wallet not connected</>)
        }
    }

    return (
        <div id={styles.createPollIFrame} style={{'display': state.display}}>
            <div id={styles.createPoll}>
                <div id={styles.createPollTitleAndSvg}>
                    <h2 id={styles.createPollTitle}>Create poll:</h2>
                    <CrossIcon onClick={rootContext.methods.removeDisplayedElement} id={styles.closeCreatePoll} />
                </div>

                <div id={styles.form}>
                    <label htmlFor="receiverId">Receiver ID:</label>
                    <input type="number" id={styles.receiverId} min="0" max="1000000" step="1" onChange={event => {
                        setState(prevState => ({...prevState, receiverId: Number(event.target.value)}))}} ref={input => {receiverId = input}}/>
                    <label htmlFor="oracleId">Oracle ID:</label>
                    <input type="number" id={styles.oracleId} min="0" max="1000000" step="1" onChange={event => {
                        setState(prevState => ({...prevState, oracleId: Number(event.target.value)}))}} />
                    <label htmlFor="contribution">Amount contributed:</label>
                    <input type="number" id={styles.contribution} min="0.0001" max="10000.000000000000000000" step="0.0001" onChange={event => {
                        setState(prevState => ({...prevState, amountContributed: Number(toWei(event.target.value))}))}}/>
                    <label htmlFor="dateLimit">Date limit:</label>
                    <input type="date" id={styles.dateLimit} onChange={event => {
                        setState(prevState => ({...prevState, dateLimit: Number(convertDateToUnix(event.target.value))}))}}/>
                    <label htmlFor="requirement">Requirement:</label>
                    <textarea id={styles.requirement} onChange={event => {
                        setState(prevState => ({...prevState, requirement: event.target.value}))}}></textarea>
                </div>
            </div>  
            <div id={styles.buttons}>
                {/*TODO cancel button should clear the inputs*/}
                <div id={styles.cancel} onClick={rootContext.methods.removeDisplayedElement}>Cancel</div>
                <div id={styles.create} onClick={createPollListener}>Create</div>
            </div>
        </div>
    )
}

