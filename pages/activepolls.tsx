import { useLazyQuery } from '@apollo/client'
import React from 'react'
import { useMediaQuery } from 'react-responsive'
import LoadingElement from '../components/GlobalComponents/loadingElement'
import ScreenerBox from '../components/GlobalComponents/screenerBox'
import { IRootContextType, RootContext } from '../components/GlobalComponents/screenerLayoutWrapper'
import PollScreenerLegend from '../components/PollsComponents/pollScreenerLegend'
import PollListElement, { PollParticipantTypes } from '../components/PollsComponents/pollsListElement'
import { contributionsByContributorAddressQuery, IContribution, IPoll, pollsByOracleIdQuery, pollsByReceiverIdQuery } from '../library/graphqlQuerys'
import { getOracleId, getReceiverId } from '../library/web3methods'
import styles from '../styles/activePollsList.module.scss'

enum ParticipantType {
    Receiver = "Receiver", 
    Contributor = "Contributor",
    Oracle = "Oracle"
}

const ActivePolls = (): React.ReactElement => {
    const rootContext: IRootContextType = React.useContext(RootContext)
    const isMobile = useMediaQuery({ maxWidth: 1200})
    const [currentParticipantTypeSelected, setCurrentParticipantTypeSelected] 
        = React.useState<ParticipantType>(ParticipantType.Receiver)

    const [getPollsAsOracle, pollsAsOracle] = useLazyQuery<{polls: IPoll[]}>(pollsByOracleIdQuery)
    const [getPollsAsReceiver, pollsAsReceiver] = useLazyQuery<{polls: IPoll[]}>(pollsByReceiverIdQuery)
    const [getContributionsAsContributor, contributionsAsContributor] 
        = useLazyQuery<{contributions: IContribution[]}>(contributionsByContributorAddressQuery)

    React.useEffect(() => {
        rootContext.methods.setActivePage("activepolls")
    }, [])

    React.useEffect((): void => {
        const callback = async(): Promise<void> => {
            if (rootContext.state.pollRewardsInstance != null && rootContext.state.account != undefined) {
                getPollsAsOracle({variables: {oracleId: await getOracleId(rootContext.state.accountsStorageInstance, rootContext.state.account)}})
                getPollsAsReceiver({variables: {receiverId: await getReceiverId(rootContext.state.accountsStorageInstance, rootContext.state.account)}})
                getContributionsAsContributor({variables: {contributorAddress: rootContext.state.account}})
            }
        }

        callback()
    }, [rootContext.state.pollRewardsInstance, rootContext.state.account])

    const Result = () => {
        return (
            <>
                {
                    isMobile ?
                        <div id={styles.pollType}>
                            <ParticipantTypeElementMobile participantType={ParticipantType.Receiver} />
                            <ParticipantTypeElementMobile participantType={ParticipantType.Oracle} />
                            <ParticipantTypeElementMobile participantType={ParticipantType.Contributor} />
                        </div>
                        :
                        <>
                            <div id={styles.pollType}>
                                <ParticipantTypeElement participantType={ParticipantType.Receiver} />
                                <ParticipantTypeElement participantType={ParticipantType.Oracle} />
                                <ParticipantTypeElement participantType={ParticipantType.Contributor} />
                            </div> 

                            <PollScreenerLegend />
                        </>
                }

                <ScreenerBox>
                    <ShowActivePollsList />
                </ScreenerBox>
            </>
        )
    }

    const ParticipantTypeElementMobile = (props: {participantType: ParticipantType}):React.ReactElement => {
        if (props.participantType == currentParticipantTypeSelected) {
            return <div className={`${styles.pollTypeElement} ${styles.activePoll}`} onClick={() => {setCurrentParticipantTypeSelected(props.participantType)}}>{props.participantType}</div>
        }

        return <div className={styles.pollTypeElement} onClick={() => {setCurrentParticipantTypeSelected(props.participantType)}}>{props.participantType}</div>
    }

    const ParticipantTypeElement = (props: {participantType: ParticipantType}):React.ReactElement => {
        if (props.participantType == currentParticipantTypeSelected) {
            return <div className={`${styles.pollTypeElement} ${styles.activePoll}`} onClick={() => {setCurrentParticipantTypeSelected(props.participantType)}}>{props.participantType} polls</div>
        }

        return <div className={styles.pollTypeElement} onClick={() => {setCurrentParticipantTypeSelected(props.participantType)}}>{props.participantType} polls</div>
    }

    const ShowActivePollsList = () => {
        if (rootContext.state.account != null) {
            if (contributionsAsContributor.loading != null && contributionsAsContributor.data != undefined) {
                return <SelectListByParticipantType />
            }               
            
            return <LoadingElement className={styles.activePollsElementLoading} />
        }               
        
        return <div className={styles.noElementFound}>You need to connect with your wallet to see your polls</div>       
    }

    const SelectListByParticipantType = () => {
        switch (currentParticipantTypeSelected) {
            case ParticipantType.Receiver:
                if (pollsAsReceiver.data.polls.length > 0) {
                    let result = pollsAsReceiver.data.polls.map(poll => {
                        return <PollListElement pollData={poll} pollType={PollParticipantTypes.Receiver} key={poll.id} />
                    })

                    return <>{result}</>
                }

                return <div className={styles.noElementFound}>You don't participate in any polls as a receiver</div>

            case ParticipantType.Oracle:
                if (pollsAsOracle.data.polls.length > 0) {
                    let result = pollsAsOracle.data.polls.map(poll => {
                        return <PollListElement pollData={poll} pollType={PollParticipantTypes.Oracle} key={poll.id} />
                    })

                    return <>{result}</>
                }

                return <div className={styles.noElementFound}>You don't participate in any polls as an oracle</div>

            case ParticipantType.Contributor:
                if (contributionsAsContributor.data.contributions.length > 0) {
                    let result = contributionsAsContributor.data.contributions.map(contribution => {
                        return <PollListElement pollData={contribution.poll} pollType={PollParticipantTypes.Contributor} key={contribution.poll.id} />
                    })
                
                    return <>{result}</>
                }               
                
                return <div className={styles.noElementFound}>You don't participate in any polls as a contributor</div>
        }
    }

    return <Result />
}

export default ActivePolls