import React from "react"
import styles from "../styles/pollAditionalInfoMobileWindow.module.scss"
import { IPoll } from "../library/graphqlQuerys"
import { getDescriptionFromHash } from "../library/ipfsQuerys"
import CrossIcon from "../public/images/crossIcon.svg"

interface IPollAditionalInfoMobileState {
    requirement: string
}

interface IPollAditionalInfoMobileProps {
    pollData: IPoll
}

export function PollAditionalInfoMobile(props: IPollAditionalInfoMobileProps): React.ReactElement {
    const [state, setState] = React.useState<IPollAditionalInfoMobileState>({
        requirement: null
    })

    React.useEffect(() => {
        getDescriptionFromHash(props.pollData.hash)
            .then(response => {
                if (response) {
                    setState(prevState => ({
                        ...prevState,
                        requirement: response
                    }))
                }
            })
    }, [])

    return (
        <div 
            id={styles.globalWindow}
        >
            <div>Poll #{props.pollData.id}</div>
            <CrossIcon />
            <div>Requirement:</div>
            <div>{state.requirement}</div>
        </div>
    )
}