import React from "react"
import styles from "../../styles/createOracle.module.scss"
import CrossIcon from "../../public/images/crossIcon.svg"
import BigNumber from "bignumber.js"
import {
    createOracle,
    getOracleId
} from '../../library/web3methods'
import { RootContext, IRootContextType } from '../GlobalComponents/screenerLayoutWrapper'
import { errorMessageWithoutClick } from "../../library/alertWindows"
import ScreenMouseLock from "../GlobalComponents/screenMouseLock"

interface ICreateOracleProps {
    windowDisplayed: boolean
    closeWindow: () => void
}

interface ICreateOracleWindowState {
    responseDays: number
    responseHours: number
    oracleFee: number
} 

const CreateOracleWindow = (props: ICreateOracleProps): React.ReactElement => {
    const [state, setState] = React.useState<ICreateOracleWindowState>({
        responseDays: 0,
        responseHours: 0,
        oracleFee: 0
    })

    const rootContext: IRootContextType = React.useContext(RootContext)
    let oracleId = React.createRef() as any

    React.useEffect((): void => {
        if (props.windowDisplayed) {
            oracleId.focus()
        }
    }, [props.windowDisplayed])

    const Result = () => {
        return (
            <>
                <div 
                    id={styles.createOracleIframe} 
                    style={
                        props.windowDisplayed ?
                            {'display': 'initial'}
                            :
                            {'display': 'none'}
                    }
                >
                    <div id={styles.createOracle}>
                        <div id={styles.createOracleTitleAndSvg}>                
                            <h2 id={styles.createOracleTitle}>Create oracle:</h2>
                            <CrossIcon onClick={props.closeWindow} id={styles.closeCreateOracle} />
                        </div>  

                        <div id={styles.form}>
                            <label htmlFor="numberDaysRespond">Number of days to respond:</label>
                            <input type="number" id={styles.numberDaysRespond} min="0" max="365" step="1" onChange={event => {
                                setState(prevState => ({...prevState, responseDays: Number(event.target.value)}))}} ref={input => {oracleId = input}}></input>
                            <label htmlFor="numberHoursRespond">Number of hours to respond:</label>
                            <input type="number" id={styles.numberHoursRespond} min="0" max="24" step="1" onChange={event => {
                                setState(prevState => ({...prevState, responseHours: Number(event.target.value)}))}}></input>
                            <label htmlFor="oracleFee">Oracle fee:</label>
                            <input type="number" id={styles.oracleFee} min="0.0001" max="10000.000000000000000000" step="0.0001" onChange={event => {
                                setState(prevState => ({...prevState, oracleFee: Number(event.target.value)}))}}></input>
                        </div>
                    </div>  

                    <div id={styles.buttons}>
                        <div id={styles.cancel} onClick={props.closeWindow}>Cancel</div>
                        <div id={styles.create} onClick={createOracleListener}>Create</div>
                    </div>
                </div>

                {
                    props.windowDisplayed ?
                        <ScreenMouseLock 
                            backgroundShadowed={true}
                            removeDisplayedElement={props.closeWindow} 
                        />
                        :
                        null
                }
            </>
        )
    }

    const createOracleListener = async (): Promise<void> => {        
        if (rootContext.state.account != null) {
            let oracleId = await getOracleId(rootContext.state.accountsStorageInstance, rootContext.state.account)

            if (oracleId == 0) {
                if (
                    (state.responseDays != 0 || state.responseHours != 0) &&
                    state.oracleFee != 0
                ) {
                    let oracleFeeGWei = new BigNumber(10).pow(9).multipliedBy(state.oracleFee)
                    let responseTime = (state.responseHours + state.responseDays * 24) * 60 * 60
        
                    await createOracle(rootContext.state, responseTime, oracleFeeGWei)
                }
        
                else {
                    errorMessageWithoutClick(rootContext.state.MySwal, <>All values must be filled</>)
                }
            }

            else {
                errorMessageWithoutClick(rootContext.state.MySwal, <>This account already has an oracle created</>)
            }
        }

        else {
            errorMessageWithoutClick(rootContext.state.MySwal, <>Please connect your wallet</>)
        }
    }

    return <Result />
}

export default CreateOracleWindow