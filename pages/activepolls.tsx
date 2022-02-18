import { useApolloClient, useLazyQuery } from '@apollo/client'
import React from 'react'
import { useMediaQuery } from 'react-responsive'
import LoadingElement from '../components/Global components/loadingElement'
import ScreenerBox from '../components/Global components/screenerBox'
import { IRootContextType, RootContext } from '../components/Global components/screenerLayoutWrapper'
import PollScreenerLegend from '../components/Polls components/pollScreenerLegend'
import PollListElement, { PollParticipantTypes } from '../components/Polls components/pollsListElement'
import { getContributionsAsContributor, getPollQuery, IPoll, pollsQueryByOracleId, pollsQueryByReceiverId } from '../library/graphqlQuerys'
import { IPollStatusTypes } from '../library/utils'
import { getOracleId, getReceiverId } from '../library/web3methods'
import styles from '../styles/activePollsList.module.scss'

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

const ActivePolls = (): React.ReactElement => {
    const rootContext: IRootContextType = React.useContext(RootContext)
    const apolloClient = useApolloClient()
    const isMobile = useMediaQuery({ maxWidth: 1200})
    const [getPollsAsOracle, pollsAsOracle] = useLazyQuery<{polls: IPoll[]}>(pollsQueryByOracleId)
    const [getPollsAsReceiver, pollsAsReceiver] = useLazyQuery<{polls: IPoll[]}>(pollsQueryByReceiverId, {})

    const [state, setState] = React.useState<IActivePollsListState>({
        participantType: ParticipantType.Receiver,
        contributorPolls: null,
        walletNotConnected: true
    })

    React.useEffect(() => {
        rootContext.methods.setActivePage("activepolls")
    }, [])

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
            let response = await getContributionsAsContributor(apolloClient, rootContext.state.account)

            if (response.data != null) {
                for (let contribution of response.data) {
                    pollsAsContributor.push((await apolloClient.query({query: getPollQuery, variables: {id: contribution.pollId}})).data.poll)
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
        switch (state.participantType) {
            case ParticipantType.Receiver:
                return <ShowActivePollsList participantType={PollParticipantTypes.Receiver} />
            
            case ParticipantType.Oracle:
                return <ShowActivePollsList participantType={PollParticipantTypes.Oracle} />

            case ParticipantType.Contributor:
                return <ShowActivePollsList participantType={PollParticipantTypes.Contributor} />

            default:
                return null
        }
    }

    const ShowActivePollsList = (_props: {participantType: PollParticipantTypes}) => {
        if (state.walletNotConnected == false) {
            if (pollsAsReceiver.loading != null && pollsAsReceiver.data != undefined) {
                if (pollsAsReceiver.data.polls.length > 0) {
                    let result = pollsAsReceiver.data.polls.map(poll => {
                        return <PollListElement pollData={poll} pollType={_props.participantType} key={poll.id} />
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
        isMobile ?
            <MobileVersion />
            :
            <DesktopVersion />
    )
}

export default ActivePolls