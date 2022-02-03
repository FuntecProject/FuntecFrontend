import BigNumber from "bignumber.js"
import { IPoll } from "./graphqlQuerys"
import React from "react"
import polls from "../pages/polls"
import oracles from "../pages/oracles"
import activePolls from "../pages/activepolls"
import welcome from "../pages/index"

const converGWeiToEth = (wei: string) => {
    return (new BigNumber(wei).div('1000000000')).toString()
}

const getReadableDate = (unixDate: string) => {
    let date = new Date(Number(unixDate) * 1000)
    
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

const convertDateToUnix = (date: string): string => {
    return (Math.floor(Number(new Date(date)) / 1000)).toString()
}

const getDaysAndHoursFromUnix = (unixTime: string) => {
    const numberDays = Math.floor((Number(unixTime) / 3600) / 24)
    const numberHours = (Number(unixTime) / 3600) % 24

    if (numberDays == 1) {
        return `${numberDays} day and ${numberHours} hours`
    }

    else {
        return `${numberDays} days and ${numberHours} hours`
    }
}

const getTwoDecimalPercent = (cuantity: number, total: string) => {
    if (Number(total) > 0) {
        return Math.round((cuantity / Number(total)) * 10000) / 100
    }

    else {
        return 'N/A'
    }
}

const getCurrentTimeUnix = () => {
    return Math.floor(Date.now() / 1000)
}

enum IPollStatusTypes {
    Open = "Open",
    PendingOracleResult = "Pending oracle result",
    ClaimPeriodOpen = "Claim period open",
    PendingUltimateOracleResult = "Pending ultimate oracle result",
    Closed = "Closed"
}

const getPollStatus = (pollData: IPoll): [IPollStatusTypes, string] => {
    let currentTime = getCurrentTimeUnix()
    let dateLimit = Number(pollData.dateLimit)
    let oracleResponseTime = Number(pollData.oracleResponseTime)

    if (dateLimit < currentTime) {
        if ((dateLimit + oracleResponseTime) < currentTime) {
            if ((dateLimit + oracleResponseTime + 24 * 60 * 60) < currentTime) {
                if (pollData.oracleResolved) {
                    if (pollData.disputed) {
                        if (pollData.ultimateOracleResolved) {
                            return [IPollStatusTypes.Closed, pollData.ultimateOracleResult.toString()]
                        }

                        else {
                            return [IPollStatusTypes.PendingOracleResult, "N/A"]
                        }
                    }

                    else {
                        return [IPollStatusTypes.Closed, pollData.oracleResult.toString()]
                    }
                }

                else {
                    if (pollData.disputed) {
                        if (pollData.ultimateOracleResolved) {
                            return [IPollStatusTypes.Closed, pollData.ultimateOracleResult.toString()]
                        }

                        else {
                            return [IPollStatusTypes.PendingOracleResult, "N/A"]
                        }
                    }

                    else {
                        return [IPollStatusTypes.Closed, "Not resolved"]
                    }
                }
            } 

            else {
                if (pollData.oracleResolved) {
                    return [IPollStatusTypes.ClaimPeriodOpen, pollData.oracleResult.toString()]
                }

                else {
                    return [IPollStatusTypes.ClaimPeriodOpen, "N/A"]
                }
            }
        }

        else {
            return [IPollStatusTypes.PendingOracleResult, "N/A"]
        }
    }

    else {
        return [IPollStatusTypes.Open, "N/A"]
    }
}

let removeElementWhenClickOutside = (
    targetElement: HTMLElement, 
    elementToCheck: HTMLElement, 
    actionToPerformWhenClickOutside: () => void
): void => {

    while (elementToCheck) {
        if (targetElement == elementToCheck) {
            document.querySelector('html').addEventListener('click', ev => {
                if (ev.target instanceof HTMLElement) {
                    removeElementWhenClickOutside(targetElement, ev.target, actionToPerformWhenClickOutside)
                }
            }, {once: true})

            return 
        }

        elementToCheck = elementToCheck.parentElement
    }

    actionToPerformWhenClickOutside()
}

let splitPascalCase = (str: string) => {
    let arraySeparatedWords = str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').replace(/([a-z])([A-Z])/g, '$1 $2').split(' ')

    return arraySeparatedWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

let getComponentName = (component: React.FunctionComponent) => {
    switch (component) {
        case polls:
            return 'Polls'
        case oracles:
            return 'Oracles'
        case activePolls:
            return 'Active polls'
        case welcome:
            return 'Futec'
        default:
            return 'N/A'
    }
}

export {
    converGWeiToEth,
    convertDateToUnix,
    getCurrentTimeUnix,
    getReadableDate,
    getDaysAndHoursFromUnix,
    getTwoDecimalPercent,
    getPollStatus,
    IPollStatusTypes,
    splitPascalCase,
    getComponentName
}