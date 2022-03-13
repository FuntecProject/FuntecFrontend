import { useLazyQuery } from '@apollo/client'
import React from 'react'
import { useMediaQuery } from 'react-responsive'
import LoadingElement from '../../components/GlobalComponents/loadingElement'
import ScreenerBox from '../../components/GlobalComponents/screenerBox'
import { IRootContextType, RootContext } from '../../components/GlobalComponents/screenerLayoutWrapper'
import PollScreenerLegend from '../../components/PollsComponents/pollScreenerLegend'
import PollListElement, { PollParticipantTypes } from '../../components/PollsComponents/pollsListElement'
import { contributionsByContributorAddressQuery, IContribution, IPoll, pollsByOracleIdQuery, pollsByReceiverIdQuery } from '../../library/graphqlQuerys'
import { getOracleId, getReceiverId } from '../../library/web3methods'
import styles from '../../styles/ComponentsStyles/PollsComponentsStyles/activePollsList.module.scss'

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
        rootContext.setActivePage("activepolls")
    }, [])

    React.useEffect((): void => {
        const callback = async(): Promise<void> => {
            if (rootContext.web3ConnectionData.pollRewardsInstance != null && rootContext.web3ConnectionData.account != undefined) {
                getPollsAsOracle({variables: {oracleId: await getOracleId(rootContext.web3ConnectionData.accountsStorageInstance, rootContext.web3ConnectionData.account)}})
                getPollsAsReceiver({variables: {receiverId: await getReceiverId(rootContext.web3ConnectionData.accountsStorageInstance, rootContext.web3ConnectionData.account)}})
                getContributionsAsContributor({variables: {contributorAddress: rootContext.web3ConnectionData.account}})
            }
        }

        callback()
    }, [rootContext.web3ConnectionData.pollRewardsInstance, rootContext.web3ConnectionData.account])

    const Result = () => {
        return (
            <>
                <div id={styles.pollType} className="mobileView">
                    <ParticipantTypeElementMobile participantType={ParticipantType.Receiver} />
                    <ParticipantTypeElementMobile participantType={ParticipantType.Oracle} />
                    <ParticipantTypeElementMobile participantType={ParticipantType.Contributor} />
                </div>    

                <div id={styles.pollType} className="desktopView">
                    <ParticipantTypeElement participantType={ParticipantType.Receiver} />
                    <ParticipantTypeElement participantType={ParticipantType.Oracle} />
                    <ParticipantTypeElement participantType={ParticipantType.Contributor} />
                </div>       
                
                <PollScreenerLegend />

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
        return rootContext.web3ConnectionData.account != null ?
            <SelectListByParticipantType />
            :
            <div className={styles.noElementFound}>You need to connect with your wallet to see your polls</div>
    }

    const SelectListByParticipantType = () => {
        switch (currentParticipantTypeSelected) {
            case ParticipantType.Receiver:
                return ShowPollsAsReceiver()

            case ParticipantType.Oracle:
                return ShowPollsAsOracle()

            case ParticipantType.Contributor:
                return ShowActivePollsList()
        }
    }

    const ShowPollsAsReceiver = () => {
        if(pollsAsReceiver.loading != null && pollsAsReceiver.data != undefined) {
            if (pollsAsReceiver.data.polls.length > 0) {
                let pollsAsReceiverRows = pollsAsReceiver.data.polls.map(poll => {
                    return <PollListElement pollData={poll} pollType={PollParticipantTypes.Receiver} key={poll.id} />
                }) 

                return <>{pollsAsReceiverRows}</>
            }

            return <div className={styles.noElementFound}>You don't participate in any polls as a receiver</div>                    
        }

        return <LoadingElement className={styles.activePollsElementLoading} />
    }

    const ShowPollsAsOracle = () => {
        if (pollsAsReceiver.loading != null && pollsAsReceiver.data != undefined) {
            if (pollsAsOracle.data.polls.length > 0) {
                let pollsAsOracleRows = pollsAsOracle.data.polls.map(poll => {
                    return <PollListElement pollData={poll} pollType={PollParticipantTypes.Oracle} key={poll.id} />
                })

                return <>{pollsAsOracleRows}</>
            }

            return <div className={styles.noElementFound}>You don't participate in any polls as an oracle</div>
        }

        return <LoadingElement className={styles.activePollsElementLoading} />
    }

    const ShowPollsAsContributor = () => {
        if (contributionsAsContributor.loading != null && contributionsAsContributor.data != undefined) {
            if (contributionsAsContributor.data.contributions.length > 0) {
                let contributionsAsContributorRows = contributionsAsContributor.data.contributions.map(contribution => {
                    return <PollListElement pollData={contribution.poll} pollType={PollParticipantTypes.Contributor} key={contribution.poll.id} />
                })  
                
                return <>{contributionsAsContributorRows}</>
            }               
            
            return <div className={styles.noElementFound}>You don't participate in any polls as a contributor</div>
        }

        return <LoadingElement className={styles.activePollsElementLoading} />
    }

    return Result()
}

export default ActivePolls