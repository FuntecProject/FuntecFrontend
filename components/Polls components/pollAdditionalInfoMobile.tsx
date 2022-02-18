import React from "react"
import styles from "./../../styles/pollAditionalInfoMobileWindow.module.scss"
import { IPoll } from "../../library/graphqlQuerys"
import { getDescriptionFromHash } from "../../library/ipfsQuerys"
import CrossIcon from "./../../public/images/crossIcon.svg"
import ScreenMouseLock from '../Global components/screenMouseLock'
import LoadingElement from "../Global components/loadingElement"
import { PollParticipantTypes } from "./pollsListElement"

interface IPollAditionalInfoMobileState {
    requirement: string
}

interface IPollAditionalInfoMobileProps {
    pollData: IPoll
    closeWindow: () => void
    pollType: PollParticipantTypes
}

const PollAditionalInfoMobile = (props: IPollAditionalInfoMobileProps): React.ReactElement => {
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
        <>
            <div 
                id={styles.globalWindow}
            >
                <div id={styles.windowTitleAndCloseButton}>
                    <h2>Poll #{props.pollData.id}</h2>
                    <CrossIcon id={styles.closeButton} onClick={props.closeWindow} />
                </div>

                <h4 id={styles.requirementTitle}>Requirement:</h4>
                {
                    state.requirement ?
                        <div>{state.requirement}</div>
                        :
                        <LoadingElement className={styles.elementLoading}/>
                }

                <h4 id={styles.requirementTitle}>Actions:</h4>
                
            </div>

            <ScreenMouseLock 
                backgroundShadowed={true}
                removeDisplayedElement={props.closeWindow}
            />
        </>
    )
}

export default PollAditionalInfoMobile