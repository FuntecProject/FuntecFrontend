import React from "react"
import PollListElement, { PollParticipantTypes } from "./pollsListElement"
import styles from "./../../styles/pollsList.module.scss"
import LoadingElement from "../GlobalComponents/loadingElement"
import ScreenerBox from "../GlobalComponents/screenerBox"
import PollScreenerLegend from "./pollScreenerLegend"
import { 
    first5PollsQuery,
    IPoll,
    pollByIdQuery
} from "../../library/graphqlQuerys"
import { useQuery, useLazyQuery } from "@apollo/client"
import { useMediaQuery } from 'react-responsive'

interface IPollsListProps {
    idSearched: string
}

const PollsList = (props: IPollsListProps): React.ReactElement => {
    const polls = useQuery<{polls: IPoll[]}>(first5PollsQuery)
    const [getPoll, poll] = useLazyQuery<{poll: IPoll}>(pollByIdQuery)
    const isMobile = useMediaQuery({ maxWidth: 1200})

    React.useEffect(() => {
        if (props.idSearched != '') {
            getPoll({variables: {id: props.idSearched}})
        }
    }, [props.idSearched])

    const Result = () => {
        return (
            <>
                {
                    isMobile ?
                        null
                        :
                        <PollScreenerLegend/>
                }

                <ScreenerBox>
                    <Content />
                </ScreenerBox>
            </>
        )
    }

    const Content = (): React.ReactElement => {
        if (props.idSearched != '') {
            if (poll.loading != true && poll.data != undefined) {
                if (poll.data.poll != null) {
                    return (
                        <>
                            <div className={styles.pollTitle}>The poll searched:</div>
                            <PollListElement pollType={PollParticipantTypes.Contribute} pollData={poll.data.poll} />
                        </>
                    )
                }

                return <div className={styles.noElementFound}>The poll searched doesn't exist</div>
            }

            return <LoadingElement className={styles.pollElementLoading} />
        }

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
        
        return <LoadingElement className={styles.pollElementLoading} />
    }

    return <Result />
}

export default PollsList