import BigNumber from "bignumber.js"
import { IPoll } from "./graphqlQuerys"
import metaData from "../../public/etc/metaData.json"
import { fromWei } from 'web3-utils'

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

const getUsdPrice = async(): Promise<number> => {
    let response = await fetch(metaData.usdPriceUrl)

    return (await response.json()).ethereum.usd
}

const getEtherFormated = (amount: BigNumber) => {
    if (amount.decimalPlaces() > 9) {
        return amount.toFixed(9).toString()
    }

    return amount.toString()
}

const displayAmount = (amountInUSD: boolean, amountInWei: string, usdPrice?: number) => {
    let etherAmount = new BigNumber(fromWei(amountInWei))

    if (amountInUSD) {
        if (usdPrice) {
            return `$${etherAmount.multipliedBy(usdPrice.valueOf()).toFixed(2).toString()}`
        }

        return '-'
    }

    return `${getEtherFormated(etherAmount)} ETH`
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
    displayAmount,
    getUsdPrice
}