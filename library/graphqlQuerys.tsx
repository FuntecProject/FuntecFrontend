import { ApolloClient, InMemoryCache, gql, NormalizedCacheObject } from "@apollo/client"

interface IOracle {
    id: string,
    previousId: string,
    oracleFee: string,
    responseTime: string,
    disabledOracle: boolean,
    amountManaged: string,
    numberPollsWrong: string,
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
    pollId: string,
    amountContributed: string,
    hasRequested: boolean
}

const oracleParameters = `
    id
    previousId
    oracleFee
    responseTime
    disabledOracle
    amountManaged
    numberPollsWrong
    numberPollsHandled
`

const pollParameters = `
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

const contributionParameters = `
    id
    contributorAddress
    pollId
    amountContributed
    hasRequested
`

const contributionsQuery = (whereClause: string): string => {
    return `
        query {
            contributions (${whereClause}) {
                ${contributionParameters}
            }
        }
    `
}

const pollsQueryByOracleId = gql`
    query polls($oracleId: String!) {
        polls(where: {oracleId: $oracleId}) {
            ${pollParameters}
        }
    }
`

const pollsQueryByReceiverId = gql`
    query polls($receiverId: String!) {
        polls(where: {receiverId: $receiverId}) {
            ${pollParameters}
        }
    }
`

const getOracleQuery = gql`
    query Oracle($id: String!) {
        oracle(id: $id) {
            ${oracleParameters}
        }
    }
`

const oraclesQuery = gql`
    query Oracles {
        oracles(first: 10) {
            ${oracleParameters}
        }
    }
`

const getPollQuery = gql`
    query Poll($id: String!) {
        poll(id: $id) {
            ${pollParameters}
        }
    }
`
const getPollsQuery = gql`
    query Polls {
        polls(first: 5) {
            ${pollParameters}
        }
    }
`

/** exportable methods to query the subgraph */

const getContributionsAsContributor = async (_client: ApolloClient<NormalizedCacheObject> , _contributorAddress: string): Promise<{data: Array<IContribution> | null, error: string | null}> => {
    try {
        return {
            data: (await _client.query({query: gql(contributionsQuery(`where: {contributorAddress: "${_contributorAddress}"}`))})).data.contributions,
            error: null
        }
    }

    catch {
        return {
            data: null,
            error: "There is a problem with the connection"
        }
    }
}

export {
    oraclesQuery,
    contributionsQuery,
    getContributionsAsContributor,
    getOracleQuery,
    getPollQuery,
    pollsQueryByOracleId,
    pollsQueryByReceiverId,
    getPollsQuery
}

export type {
    IPoll,
    IContribution,
    IOracle,
}

