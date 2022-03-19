import React from 'react'
import { 
    contribute, 
    claimReceiverReward, 
    generateDispute, 
    claimContributorReward,
    claimOracleReward, 
    solvePoll
} from '../../library/web3methods'

import { 
    checkIfContributorCanContribute,
    checkIfPollCanBeDisputed,
    checkIfContributorCanClaim,
    checkIfOracleCanClaim,
    checkIfOracleCanResolve,
    checkIfReceiverCanClaim
} from '../../library/web3Checks'
import styles from "./../../styles/ComponentsStyles/PollsComponentsStyles/pollsListElement.module.scss"
import { IPoll } from '../../library/graphqlQuerys'
import { errorMessageWithoutClick } from '../../library/alertWindows'
import { toWei } from 'web3-utils'
import { useAppDispatch, useAppSelector } from '../../src/app/hooks'

interface IPollListElementRowProps {
    pollData: IPoll
}

interface IOracleRowState {
    canClaim: boolean,
    canResolve: boolean,
    oracleDecissionResult: boolean
}

const OracleRow = (props: IPollListElementRowProps): React.ReactElement => {    
    const [state, setState] = React.useState<IOracleRowState>({
        canClaim: false,
        canResolve: false,
        oracleDecissionResult: true
    })

    const web3ConnectionData = useAppSelector(state => state.web3ConnectionData)

    React.useEffect(() => {
        const callback = async() => {
            let oracleCanClaimPromise = checkIfOracleCanClaim(props.pollData)
            let oracleCanResolvePromise = checkIfOracleCanResolve(props.pollData)

            let oracleCanClaim = await oracleCanClaimPromise
            let oracleCanResolve = await oracleCanResolvePromise

            setState(prevState => ({
                ...prevState,
                canClaim: oracleCanClaim,
                canResolve: oracleCanResolve
            }))
        }

        if (web3ConnectionData.pollRewardsInstance && web3ConnectionData.account) {
            callback()
        }
    }, [web3ConnectionData.pollRewardsInstance, web3ConnectionData.account])


    return (
        <div className={styles.activePollThirdRow}>
            <div className={styles.leftSide}>
                <input 
                    className={state.canClaim ? styles.activePollButton : styles.activePollButtonDisabled} 
                    type={"button"} 
                    value={"Claim oracle reward"}
                    onClick={(): void => {
                        if(state.canClaim) {
                            claimOracleReward(web3ConnectionData.pollRewardsInstance, web3ConnectionData.account, props.pollData.id)
                        }

                        else {
                            errorMessageWithoutClick(<>Oracle reward can't be claimed</>)
                        }
                    }}
                ></input>
            </div>
            
            <div>
                <div style={{'marginRight': '20px'}}>Did the creator fullfill the requirement?</div>
                <select 
                    className={styles.activePollSelect}
                    onChange={(ev): void => {
                        setState(prevState => ({
                            ...prevState,
                            oracleDecissionResult: Boolean(Number(ev.target.value))
                        }))
                    }}
                >
                    <option value="1">True</option>
                    <option value="0">False</option>
                </select>

                <input 
                    // className={state.canResolve ? styles.activePollButton : styles.activePollButtonDisabled} 
                    className={styles.activePollButton}
                    type={"button"} 
                    value={"Resolve poll"}
                    onClick={(): void => {
                        if (state.canResolve) {
                            solvePoll(web3ConnectionData.pollRewardsInstance, web3ConnectionData.account, state.oracleDecissionResult, props.pollData.id)
                        }

                        else {
                            errorMessageWithoutClick(<>Poll can't be resolved</>)
                        }
                    }}
                ></input>
            </div>
        </div>
    )
}

interface IReceiverAndContributorRowState {
    canClaim: boolean
    canDispute: boolean
}

const ReceiverRow = (props: IPollListElementRowProps): React.ReactElement => {
    const [state, setState] = React.useState<IReceiverAndContributorRowState>({
        canClaim: false,
        canDispute: false
    })

    const web3ConnectionData = useAppSelector(state => state.web3ConnectionData)

    React.useEffect(() => {
        const canClaim = checkIfReceiverCanClaim(props.pollData)
        const canDispute = checkIfPollCanBeDisputed(props.pollData)

        setState(prevState => ({
            ...prevState,
            canClaim: canClaim,
            canDispute: canDispute
        }))
    }, [])

    return (
        <div className={`${styles.activePollThirdRow} ${styles.poll}`}>
            <div className={styles.leftSide}>
                <input 
                    className={state.canClaim ? styles.activePollButton : styles.activePollButtonDisabled} 
                    type={"button"} 
                    value={"Claim receiver reward"}
                    onClick={(): void => {
                        if (state.canClaim) {
                            claimReceiverReward(web3ConnectionData.pollRewardsInstance, web3ConnectionData.account, props.pollData.id)
                        }

                        else {
                            errorMessageWithoutClick(<>Receiver reward can't be claimed</>)
                        }
                    }}
                ></input>
            </div>

            <div>
                <div style={{'marginRight': '20px'}}>Don't you agree with the result?</div>
                <input 
                    className={state.canDispute ? styles.activePollButton : styles.activePollButtonDisabled} 
                    type={"button"} 
                    value={"Open dispute"}
                    onClick={(): void => {
                        if (state.canDispute) {
                            generateDispute(web3ConnectionData.pollRewardsInstance, web3ConnectionData.account, props.pollData.id)
                        }

                        else {
                            errorMessageWithoutClick(<>Poll can't be disputed</>)
                        }
                    }}
                ></input>
            </div>
        </div>
    )
}

const ContributorRow = (props: IPollListElementRowProps): React.ReactElement => {
    const [state, setState] = React.useState<IReceiverAndContributorRowState>({
        canClaim: false,
        canDispute: false
    })

    const web3ConnectionData = useAppSelector(state => state.web3ConnectionData)

    React.useEffect(() => {
        const callback = async () => {
            const canDispute = checkIfPollCanBeDisputed(props.pollData)

            setState(prevState => ({
                ...prevState,
                canDispute: canDispute
            }))
        }

        callback()
    }, [])

    React.useEffect(() => {
        const callback = async () => {
            const canClaim = await checkIfContributorCanClaim(web3ConnectionData.pollRewardsInstance, web3ConnectionData.account, props.pollData)

            setState(prevState => ({
                ...prevState,
                canClaim: canClaim
            }))
        }

        callback()
    }, [web3ConnectionData.pollRewardsInstance, web3ConnectionData.account])

    return (
        <div className={styles.activePollThirdRow}>
            <div className={styles.leftSide}>
                <input 
                    className={state.canClaim ? styles.activePollButton : styles.activePollButtonDisabled} 
                    type={"button"} 
                    value={"Claim contribution"}
                    onClick={(): void => {
                        if (state.canClaim) {
                            claimContributorReward(web3ConnectionData.pollRewardsInstance, web3ConnectionData.account, props.pollData.id)
                        }

                        else {
                            errorMessageWithoutClick(<>Contribution can't be claimed</>)
                        }
                    }}
                ></input>
            </div>
            <div>
                <div style={{'marginRight': '20px'}}>Don't you agree with the result?<table></table></div>
                <input 
                    className={state.canDispute ? styles.activePollButton : styles.activePollButtonDisabled} 
                    type={"button"} 
                    value={"Open dispute"}
                    onClick={(): void => {
                        if (state.canDispute) {
                            generateDispute(web3ConnectionData.pollRewardsInstance, web3ConnectionData.account, props.pollData.id)
                        }

                        else {
                            errorMessageWithoutClick(<>Poll can't be disputed</>)
                        }
                    }}
                ></input>
            </div>
        </div>
    )
}

interface IContributeRowState {
    contribution: string | null
    canContribute: boolean
}

const ContributeRow = (props: IPollListElementRowProps): React.ReactElement => {
    const [state, setState] = React.useState<IContributeRowState>({
        contribution: null,
        canContribute: false
    })

    const web3ConnectionData = useAppSelector(state => state.web3ConnectionData)

    React.useEffect((): void => {
        const callback = async(): Promise<void> => {
            let canContribute = await checkIfContributorCanContribute(props.pollData)

            setState(prevState => ({
                ...prevState,
                canContribute: canContribute
            }))
        }

        callback()
    }, [props.pollData])

    return (
        <div className={styles.pollThirdRow}>
            <input 
                type="number"
                id={styles.contributeAmountSelect} 
                min="0.0001"
                max="10000.1111"
                step="0.0001"
                onChange={ev => {
                    setState(prevState => ({
                        ...prevState,
                        contribution: ev.target.value
                    }))
                }}
            ></input>

            <input  
                type={"button"} 
                onClick={async (): Promise<void> => {
                    if (state.canContribute) {
                        if (state.contribution != null) {
                            if (web3ConnectionData.account) {
                                await contribute(web3ConnectionData.pollRewardsInstance, web3ConnectionData.account, props.pollData.id, toWei(state.contribution))
                            }

                            else { 
                                errorMessageWithoutClick(<>Connect with your wallet first to contribute</>)                      
                            }
                        }

                        else {
                            errorMessageWithoutClick(<>Contribution can't be empty</>)
                        }
                    } 

                    else {
                        errorMessageWithoutClick(<>Contribution period is over</>)
                    }
                }} 
                value={"Contribute"}
                className={state.canContribute ? styles.contributeButton : styles.contributeButtonDisabled}
            ></input>
        </div>
    )
}

export {
    OracleRow,
    ReceiverRow,
    ContributorRow,
    ContributeRow
}