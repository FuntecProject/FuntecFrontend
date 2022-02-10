import React from "react"
import PollListElement, { PollParticipantTypes } from "./pollsListElement"
import styles from "../styles/pollsList.module.scss"
import LoadingElement from "./loadingElement"
import ScreenerBox from "./screenerBox"
import PollScreenerLegend from "./pollScreenerLegend"
import { 
    IPoll,
    getPollQuery,
    getPollsQuery
} from "./../library/graphqlQuerys"
import { IPollsState } from "../pages/polls"
import { useQuery, useLazyQuery } from "@apollo/client"
import { useMediaQuery } from 'react-responsive'

interface IPollsListProps {
    parentState: IPollsState
}

export default function PollsList(props: IPollsListProps): React.ReactElement {
    const polls = useQuery<{polls: IPoll[]}>(getPollsQuery)
    const [getPoll, poll] = useLazyQuery<{poll: IPoll}>(getPollQuery)
    const isMobile = useMediaQuery({ maxWidth: 1200})

    React.useEffect(() => {
        if (props.parentState.idSearched != '') {
            getPoll({variables: {id: props.parentState.idSearched}})
        }
    }, [props.parentState.idSearched])

    const Content = (): React.ReactElement => {
        if (props.parentState.idSearched != '') {
            if (poll.loading != true && poll.data != undefined) {
                if (poll.data.poll != null) {
                    return (
                        <>
                            <div className={styles.pollTitle}>The poll searched:</div>
                            <PollListElement pollType={PollParticipantTypes.Contribute} pollData={poll.data.poll} />
                        </>
                    )
                }

                else {
                    return <div className={styles.noElementFound}>The poll searched doesn't exist</div>
                }
            }

            else {
                return <LoadingElement className={styles.pollElementLoading} />
            }
        }

        else {
            if (polls.loading == false && polls.data != undefined) {
                let pollsElements = polls.data.polls.map(poll => {
                    return <PollListElement pollType={PollParticipantTypes.Contribute} pollData={poll} key={poll.id} />
                })

                return (
                    <>
                        <div className={styles.pollTitle}>Last polls created:</div>
                        {pollsElements}
                    </>
                )
            }

            else {
                return <LoadingElement className={styles.pollElementLoading} />
            }
        }
    }

    const DesktopVersion = () => {
        return (
            <>
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