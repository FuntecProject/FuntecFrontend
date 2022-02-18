import { getCurrentTimeUnix } from "./utils"
import { IPoll } from "./graphqlQuerys"
import { IRootContextType } from "../components/Global components/screenerLayoutWrapper"
import { contributorHasRequested } from "./web3methods"

const checkIfOracleCanClaim = async (pollData: IPoll): Promise<boolean> => {
    let _currentTimeUnix = getCurrentTimeUnix()

    if (
        pollData.oracleRewardRequested == false &&
        pollData.oracleResolved == true 
    ) {

        if (pollData.disputed) {
            if (
                pollData.ultimateOracleResolved &&
                pollData.ultimateOracleResult == pollData.oracleResult
            ) {
                return true
            }
        }

        else {
            if ((Number(pollData.dateLimit) + Number(pollData.oracleResponseTime) + 24 * 60 * 60) < _currentTimeUnix) {
                return true
            }
        }
    }

    return false
}   

const checkIfContributorCanClaim = async (rootContext: IRootContextType, pollData: IPoll): Promise<boolean> => {
    let _currentTimeUnix = getCurrentTimeUnix()
    let _contributorHasRequested = await contributorHasRequested(rootContext.state.pollRewardsInstance, rootContext.state.account, pollData.id)

    if (
        _contributorHasRequested == false &&
        (Number(pollData.dateLimit) + Number(pollData.oracleResponseTime) + 24 * 60 * 60) < _currentTimeUnix
    ) {
        return true
    }

    return false
}

const checkIfReceiverCanClaim = (pollData: IPoll): boolean => {
    let _currentTimeUnix = getCurrentTimeUnix()

    if (
        pollData.receiverRewardRequested == false &&
        (Number(pollData.dateLimit) + Number(pollData.oracleResponseTime) + 24 * 60 * 60) < _currentTimeUnix
    ) {
        return true
    }

    return false
}

const checkIfOracleCanResolve = async (pollData: IPoll): Promise<boolean> => {
    let currentTimeUnix = getCurrentTimeUnix()
    
    //TODO check total amount contributed

    if (
        pollData.oracleResolved == false &&
        Number(pollData.dateLimit) < Number(currentTimeUnix) &&
        currentTimeUnix < (Number(pollData.dateLimit) + Number(pollData.oracleResponseTime))
    ) {
        return true
    }

    return false
}

const checkIfContributorCanContribute = async (pollData: IPoll): Promise<boolean> => {
    if (getCurrentTimeUnix() < Number(pollData.dateLimit)) {
        return true
    } 

    return false
}

const checkIfPollCanBeDisputed = (pollData: IPoll): boolean => {
    if (
        pollData.disputed == false &&
        getCurrentTimeUnix() < (Number(pollData.dateLimit) + Number(pollData.oracleResponseTime) + 24 * 60 * 60)
    ) {
        return true
    }

    return false
}

export {
    checkIfOracleCanClaim,
    checkIfContributorCanClaim,
    checkIfReceiverCanClaim,
    checkIfOracleCanResolve,
    checkIfContributorCanContribute,
    checkIfPollCanBeDisputed
}