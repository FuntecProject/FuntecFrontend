import React from 'react'
import { RootContext, IRootContextType } from './screenerLayoutWrapper'
import styles from '../styles/activePollsList.module.scss'
import { 
    IPoll, 
    getContributionsAsContributor, 
    pollsQueryByOracleId,
    pollsQueryByReceiverId, 
    getPollQuery
} from '../library/graphqlQuerys'
import { getOracleId, getReceiverId } from '../library/web3methods'
import PollListElement, { PollParticipantTypes } from './pollsListElement'
import PollScreenerLegend from './pollScreenerLegend'
import ScreenerBox from './screenerBox'
import LoadingElement from './loadingElement'
import { useLazyQuery } from "@apollo/client"
import { useMediaQuery } from 'react-responsive'

enum ParticipantType {
    Receiver = "Receiver", 
    Contributor = "Contributor",
    Oracle = "Oracle"
}

interface IActivePollsListState {
    participantType: ParticipantType
    contributorPolls: Array<IPoll> | null
    walletNotConnected: boolean 
}

export default function ActivePollsList(): React.ReactElement {
    const rootContext: IRootContextType = React.useContext(RootContext) 
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })
    const [getPollsAsOracle, pollsAsOracle] = useLazyQuery<{polls: IPoll[]}>(pollsQueryByOracleId)
    const [getPollsAsReceiver, pollsAsReceiver] = useLazyQuery<{polls: IPoll[]}>(pollsQueryByReceiverId, {})

    const [state, setState] = React.useState<IActivePollsListState>({
        participantType: ParticipantType.Receiver,
        contributorPolls: null,
        walletNotConnected: true
    })

    React.useEffect((): void => {
        const callback = async(): Promise<void> => {
            if (rootContext.state.pollRewardsInstance != null && rootContext.state.account != undefined) {
                getPollsAsOracle({variables: {oracleId: await getOracleId(rootContext.state.accountsStorageInstance, rootContext.state.account)}})
                getPollsAsReceiver({variables: {receiverId: await getReceiverId(rootContext.state.accountsStorageInstance, rootContext.state.account)}})
                let contributorPolls = await getPollsAsContributor()

                setState(prevState => ({
                    ...prevState,
                    walletNotConnected: false,
                    contributorPolls: contributorPolls
                }))
            }
        }

        callback()
    }, [rootContext.state.pollRewardsInstance, rootContext.state.account])

    const getPollsAsContributor = async () => {
        let pollsAsContributor: Array<IPoll> | null = []
        
        if (rootContext.state.account != null) {
            let response = await getContributionsAsContributor(rootContext.state.client, rootContext.state.account)

            if (response.data != null) {
                for (let contribution of response.data) {
                    pollsAsContributor.push((await rootContext.state.client.query({query: getPollQuery, variables: {id: contribution.pollId}})).data.poll)
                }
            }
    
            else {
                pollsAsContributor = null
            }
    
            return pollsAsContributor
        }

        return null
    }

    const setParticipantTypeState = (participantType: ParticipantType): void => {
        setState(previousState => ({
            ...previousState,
            participantType: participantType
        }))
    }

    const ParticipantTypeElement = (props: {participantType: ParticipantType}):React.ReactElement => {
        if (props.participantType == state.participantType) {
            return <div className={`${styles.pollTypeElement} ${styles.activePoll}`} onClick={() => {setParticipantTypeState(props.participantType)}}>{props.participantType} polls</div>
        }

        return <div className={styles.pollTypeElement} onClick={() => {setParticipantTypeState(props.participantType)}}>{props.participantType} polls</div>
    }

    const ParticipantTypeElementMobile = (props: {participantType: ParticipantType}):React.ReactElement => {
        if (props.participantType == state.participantType) {
            return <div className={`${styles.pollTypeElement} ${styles.activePoll}`} onClick={() => {setParticipantTypeState(props.participantType)}}>{props.participantType}</div>
        }

        return <div className={styles.pollTypeElement} onClick={() => {setParticipantTypeState(props.participantType)}}>{props.participantType}</div>
    }

    const Content = (): React.ReactElement | null => {
        let result = null

        switch (state.participantType) {
            case ParticipantType.Receiver:
                if (state.walletNotConnected == false) {
                    if (pollsAsReceiver.loading != null && pollsAsReceiver.data != undefined) {
                        if (pollsAsReceiver.data.polls.length > 0) {
                            let result = pollsAsReceiver.data.polls.map(poll => {
                                return <PollListElement pollData={poll} pollType={PollParticipantTypes.Receiver} key={poll.id} />
                            })
                        
                            return <>{result}</>
                        }               
                        else {
                            return <div className={styles.noElementFound}>You don't participate in any polls as a receiver</div>
                        }
                    }               
                    else {
                        return <LoadingElement className={styles.activePollsElementLoading} />
                    }
                }               
                else {
                    return <div className={styles.noElementFound}>You need to connect with your wallet to see your polls</div>
                }       
            
            case ParticipantType.Oracle:
                if (state.walletNotConnected == false) {
                    if (pollsAsOracle.loading != null && pollsAsOracle.data != undefined) {
                        if (pollsAsOracle.data.polls.length > 0) {
                            let result = pollsAsOracle.data.polls.map(poll => {
                                return <PollListElement pollData={poll} pollType={PollParticipantTypes.Oracle} key={poll.id} />
                            })
                        
                            return <>{result}</>
                        }               
                        else {
                            return <div className={styles.noElementFound}>You don't participate in any poll as an oracle</div>
                        }
                    }               
                    else {
                        return <LoadingElement className={styles.activePollsElementLoading} />
                    }
                }               
                else {
                    return <div className={styles.noElementFound}>You need to connect with your wallet to see your polls</div>
                }

            case ParticipantType.Contributor:
                if (state.walletNotConnected == false) {
                    if (state.contributorPolls) {
                        if (state.contributorPolls.length > 0) {
                            let result = state.contributorPolls.map(poll => {
                                return <PollListElement pollData={poll} pollType={PollParticipantTypes.Contributor} key={poll.id} />
                            })              
                            return <>{result}</>
                        }               
                        else {
                            return <div className={styles.noElementFound}>You don't participate in any polls as a contributor</div>
                        }
                    }                   
                    else {
                        return <LoadingElement className={styles.activePollsElementLoading} />
                    }
                }               
                else {
                    return <div className={styles.noElementFound}>You need to connect with your wallet to see your polls</div>
                }

            default:
                return null
        }
    }

    const DesktopVersion = () => {
        return (
            <>
                <div id={styles.pollType}>
                    <ParticipantTypeElement participantType={ParticipantType.Receiver} />
                    <ParticipantTypeElement participantType={ParticipantType.Oracle} />
                    <ParticipantTypeElement participantType={ParticipantType.Contributor} />
                </div>

                <PollScreenerLegend />
                <ScreenerBox>
                    <Content /> 
                </ScreenerBox>
            </>
        )
    }

    const MobileVersion = () => {
        return (
            <>
                <div id={styles.pollType}>
                    <ParticipantTypeElementMobile participantType={ParticipantType.Receiver} />
                    <ParticipantTypeElementMobile participantType={ParticipantType.Oracle} />
                    <ParticipantTypeElementMobile participantType={ParticipantType.Contributor} />
                </div>

                <ScreenerBox>
                    <Content /> 
                </ScreenerBox>
            </>
        )
    }

    return (
        isDesktopOrLaptop ?
            <DesktopVersion />
            :
            <MobileVersion />
    )
}
