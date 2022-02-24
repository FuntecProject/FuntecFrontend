import { gql } from "@apollo/client"

interface IOracle {
    id: string
    previousId: string
    oracleFee: string
    responseTime: string
    disabledOracle: boolean
    amountManaged: string
    numberPollsWrong: string
    numberPollsHandled: string
}

interface IPoll {
    id: string,
    totalAmountContributed: string,
    oracleId: string,
    dateLimit: string,
    receiverId: string,
    oracleResolved: boolean,
    oracleResult: boolean,
    oracleResponseTime: string,
    disputed: boolean,
    ultimateOracleResolved: boolean,
    ultimateOracleResult: boolean,
    receiverRewardRequested: boolean,
    oracleRewardRequested: boolean,
    hash: string
}

interface IContribution {
    id: string,
    contributorAddress: string,
    amountContributed: string,
    hasRequested: boolean
    poll: IPoll
}

const pollResultElements = `
    id
    totalAmountContributed
    oracleId
    dateLimit
    receiverId
    oracleResolved
    oracleResult
    oracleResponseTime
    disputed
    ultimateOracleResolved
    ultimateOracleResult
    receiverRewardRequested
    oracleRewardRequested
    hash
`

const oracleResultElements = `
    id
    previousId
    oracleFee
    responseTime
    disabledOracle
    amountManaged
    numberPollsWrong
    numberPollsHandled
`

const contributionResultElements = `
    id
    contributorAddress
    amountContributed
    hasRequested
    poll {
        ${pollResultElements}
    }
`

/**
 * Poll's query's
 */

const pollByIdQuery = gql`
    query Poll($id: String!) {
        poll(id: $id) {
            ${pollResultElements}
        }
    }
`
const first5PollsQuery = gql`
    query Polls {
        polls(first: 5) {
            ${pollResultElements}
        }
    }
`

const pollsByOracleIdQuery = gql`
    query polls($oracleId: String!) {
        polls(where: {oracleId: $oracleId}) {
            ${pollResultElements}
        }
    }
`

const pollsByReceiverIdQuery = gql`
    query polls($receiverId: String!) {
        polls(where: {receiverId: $receiverId}) {
            ${pollResultElements}
        }
    }
`

/**
 * Oracle's query's
 */

const oracleByIdQuery = gql`
    query Oracle($id: String!) {
        oracle(id: $id) {
            ${oracleResultElements}
        }
    }
`

const first5OraclesQuery = gql`
    query Oracles {
        oracles(first: 10) {
            ${oracleResultElements}
        }
    }
`

/**
 * Contribution's query's
 */

const contributionsByContributorAddressQuery = gql`
    query contributions($contributorAddress: String!) {
        contributions (where: {contributorAddress: $contributorAddress}) {
            ${contributionResultElements}
        }
    }
`

export {
    pollByIdQuery,
    first5PollsQuery,
    pollsByOracleIdQuery,
    pollsByReceiverIdQuery,
    oracleByIdQuery,
    first5OraclesQuery,
    contributionsByContributorAddressQuery
}

export type {
    IPoll,
    IContribution,
    IOracle,
}

