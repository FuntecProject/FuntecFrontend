import React from 'react'
import Arrow from "./../../public/images/arrow.svg"
import PlusIcon from "./../../public/images/plusIcon.svg"
import styles from "./../../styles/pollsListElement.module.scss"
import {  
    getReadableDate,
    IPollStatusTypes,
    getPollStatus
} from '../../library/utils'
import { IPoll } from '../../library/graphqlQuerys'
import {
    OracleRow,
    ReceiverRow,
    ContributorRow,
    ContributeRow
} from './pollListElementRows'
import { getDescriptionFromHash } from '../../library/ipfsQuerys'
import { useMediaQuery } from 'react-responsive'
import { fromWei } from 'web3-utils'
import PollAditionalInfoMobile from './pollAdditionalInfoMobile'

interface IPollListElementProps {
    pollData: IPoll,
    key?: string,
    pollType: PollParticipantTypes
}

interface IPollListElementState {
    expand: boolean,
    pollStatus: [IPollStatusTypes, string] | null,
    description: string | null
}

enum PollParticipantTypes {
    Contribute,
    Receiver,
    Contributor,
    Oracle
}

const PollListElement = (props: IPollListElementProps): React.ReactElement => {
    const [state, setState] = React.useState<IPollListElementState>({
        expand: false,
        pollStatus: null,
        description: null
    })

    const isMobile = useMediaQuery({ maxWidth: 1200})

    React.useEffect(() => {
        let pollStatus = getPollStatus(props.pollData)      
            
        setState(prevState => ({
            ...prevState,
            pollStatus: pollStatus
        }))        

        getDescriptionFromHash(props.pollData.hash)
            .then(description => {
                setState(prevState => ({
                    ...prevState,
                    description: description
                }))
            })
    }, [])

    const Result = () => {
        if (isMobile) {
            return MobileVersion()
        }

        return DesktopVersion()
    }

    const MobileVersion = (): React.ReactElement => {
        const [pollAdditionalInfoDisplayed, setPollAditionalInfoDisplayed] = React.useState<boolean>(false)

        return (
            <div className={styles.pollElement}>
                <div className={styles.pollElementIdMobile}>
                    #{props.pollData.id}
                </div>

                <div className={styles.pollElementFirstRowMobile}>
                    <div className={styles.pollElementRowMobile}>
                        <div>State:</div>
                        <div>{state.pollStatus != null ? state.pollStatus[0] : "-"}</div>
                    </div>          

                    <div className={styles.pollElementRowMobile}>
                        <div>Result:</div>
                        <div>{state.pollStatus != null ? state.pollStatus[1] : "-"}</div>
                    </div>   

                    <div className={styles.pollElementRowMobile}>
                        <div>Total contributed:</div>
                        <div>{fromWei(props.pollData.totalAmountContributed)} ETH</div>
                    </div> 

                    <div className={styles.pollElementRowMobile}>
                        <div>Date limit:</div>
                        <div>{getReadableDate(props.pollData.dateLimit)}</div>
                    </div>        

                    <div style={{marginTop: '15px'}} className={`${styles.receiverAndOracleIdsRowMobile}`}>
                        <div className={styles.centerCell}>Receiver Id</div>
                        <div className={styles.centerCell}>Oracle Id</div>
                    </div>  

                    <div style={{marginBottom: '15px'}} className={`${styles.receiverAndOracleIdsRowMobile}`}>
                        <div className={styles.centerCell}>#{props.pollData.receiverId}</div>
                        <div className={styles.centerCell}>#{props.pollData.oracleId}</div>
                    </div>

                    <div id={styles.morePollElementMobile}>
                        <PlusIcon onClick={() => {setPollAditionalInfoDisplayed(true)}}/>
                    </div>
                    
                    {
                        pollAdditionalInfoDisplayed ?
                            <PollAditionalInfoMobile 
                                pollData={props.pollData} 
                                closeWindow={() => {setPollAditionalInfoDisplayed(false)}} 
                                pollType={props.pollType}
                            />
                            :
                            null
                    }
                </div>
            </div>
        )
    }

    const DesktopVersion = (): React.ReactElement => {
        return (
            <div className={styles.pollElement} style={{height: state.expand ? '150px' : '50px'}}>
                <div className={styles.pollElementFirstRow}>
                    <div>#{props.pollData.id}</div>
                    <div>{state.pollStatus != null ? state.pollStatus[0] : "-"}</div>
                    <div>{state.pollStatus != null ? state.pollStatus[1] : "-"}</div>
                    <div>{fromWei(props.pollData.totalAmountContributed)} ETH</div>
                    <div>{getReadableDate(props.pollData.dateLimit)}</div>
                    <div>#{props.pollData.receiverId}</div>
                    <div>#{props.pollData.oracleId}</div>
                    <div className={styles.pollExpandContainer}>
                        <Arrow 
                            className={styles.pollExpand} 
                            onClick={() => {setState(prevstate => ({
                                ...prevstate,
                                expand: !prevstate.expand
                            }))}}
                            style={{transform: state.expand ? 'rotate(180deg)' : ''}}
                        />
                    </div>
                </div>  

                <div className={styles.pollElementSecondRow}>
                    <div>Description: {state.description}</div>
                </div>  
                        
                <ThirdRow />
            </div>
        )
    }

    const ThirdRow = (): React.ReactElement | null => {
        switch (props.pollType) {
            case PollParticipantTypes.Contribute:
                return <ContributeRow pollData={props.pollData} />
        
            case PollParticipantTypes.Contributor:
                return <ContributorRow pollData={props.pollData} />

            case PollParticipantTypes.Receiver:
                return <ReceiverRow pollData={props.pollData} />

            case PollParticipantTypes.Oracle:
                return <OracleRow pollData={props.pollData} />
            
            default:
                return null
        }
    }

    return Result()
}

export default PollListElement

export {
    PollParticipantTypes
}