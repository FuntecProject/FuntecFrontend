import React from "react"
import PollListElement, { PollParticipantTypes } from "./pollsListElement"
import styles from "./../../styles/ComponentsStyles/PollsComponentsStyles/pollsList.module.scss"
import LoadingElement from "../GlobalComponents/loadingElement"
import ScreenerBox from "../GlobalComponents/screenerBox"
import PollScreenerLegend from "./pollScreenerLegend"
import {
    first5PollsQuery,
    IPoll,
    pollByIdQuery
} from "../../library/graphqlQuerys"
import { useQuery, useLazyQuery } from "@apollo/client"
import ContentLoader from 'react-content-loader'


interface IPollsListProps {
    idSearched: string
}

const PollsList = (props: IPollsListProps): React.ReactElement => {
    const polls = useQuery<{ polls: IPoll[] }>(first5PollsQuery)
    const [getPoll, poll] = useLazyQuery<{ poll: IPoll }>(pollByIdQuery)

    React.useEffect(() => {
        if (props.idSearched != '') {
            getPoll({ variables: { id: props.idSearched } })
        }
    }, [props.idSearched])

    const Result = () => {
        return (
            <>
                <PollScreenerLegend />

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

            return <PollListElementLoader />
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

        return (
            <>
                <div className={styles.pollTitle}>Last polls created:</div>
                <PollListElementLoader />
                <PollListElementLoader />
                <PollListElementLoader />
                <PollListElementLoader />
                <PollListElementLoader />
            </>
        )
    }


    const PollListElementLoader = () => (
        <ContentLoader height={50} width={2000} speed={0.8} style={{
            position: 'relative',
            width: '95%',
            marginTop: '20px',
            marginLeft: '2.5%'
            }}>
            <rect x="0" y="0" rx="4" ry="4" width="100%" height="100%" />
        </ContentLoader>
    )

    return Result()
}

export default PollsList