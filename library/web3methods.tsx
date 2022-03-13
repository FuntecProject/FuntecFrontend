import { getPollStatus } from "./utils"
import { addStringToIPFS } from "./ipfsQuerys"
import { IRootContextType } from "../components/GlobalComponents/screenerLayoutWrapper"
import BigNumber from "bignumber.js"
import { sucessMessageWithclick } from "./alertWindows"
import { Contract } from "web3-eth-contract"
import Web3 from "web3"

const createReceiverAccount = async (rootState: IRootContextType["web3ConnectionData"]): Promise<void> => {
    rootState.accountsStorageInstance.methods.createReceiverAccount().send({from: rootState.account})
        .on('error', (error: string) => {
            console.log(error)
        })
        .on('transactionHash', (tx: string) => {
            sucessMessageWithclick(
                <>Transaction has been sucessfully sent, check it out <a href={`https://rinkeby.etherscan.io/tx/${tx}`} target="_blank" rel="noopener noreferrer" style={{color: 'lightBlue'}}>here</a></>
            )
        })
        .on('receipt', async (r: string) => {
            console.log(r)
        })
}

const createOracle = async(
    rootState: IRootContextType["web3ConnectionData"],
    responseTime: Number,
    fee: BigNumber
) => {
    rootState.accountsStorageInstance.methods.createNewOracle(responseTime.toString(), fee.toString()).send({from: rootState.account})
        .on('error', (e: string) => {
            console.log(e)
        })
        .on('transactionHash', (tx: string) => {
            sucessMessageWithclick(
                <>Transaction has been sucessfully sent, check it out <a href={`https://rinkeby.etherscan.io/tx/${tx}`} target="_blank" rel="noopener noreferrer" style={{color: 'lightBlue'}}>here</a></>
            )
        })
        .on('receipt', (r: string) => {
            console.log(r)
        })
}

const createPoll = async(
    rootContext: IRootContextType,
    receiverId: number,
    oracleId: number,
    dateLimit: number,
    amount: number,
    requirement: string
): Promise<void> => {
    let hash = await addStringToIPFS(requirement)

    if (hash) {
        rootContext.web3ConnectionData.pollRewardsInstance.methods.createPoll(receiverId.toString(), dateLimit.toString(), oracleId.toString(), hash).send({from: rootContext.web3ConnectionData.account, value: amount})
            .on('error', (e: string) => {
                console.log(e)
            })
            .on('sent', (s: string) => {
                console.log(s)
            })
            .on('transactionHash', (tx:string) => {
                sucessMessageWithclick(
                    <>Transaction has been sucessfully sent, check it out <a href={`https://rinkeby.etherscan.io/tx/${tx}`} target="_blank" rel="noopener noreferrer" style={{color: 'lightBlue'}}>here</a></>
                )
            })
            .on('receipt', (r: string) => {
                console.log(r)
            })
    }
}

const contribute = async(
    rootContext: IRootContextType,
    pollId: string,
    amount: string
): Promise<void> => {
    rootContext.web3ConnectionData.pollRewardsInstance.methods.contribute(pollId).send({from: rootContext.web3ConnectionData.account, value: amount})
            .on('error', (e: string) => {
                console.log(e)
            })
            .on('transactionHash', (tx: string) => {
                sucessMessageWithclick(
                    <>Transaction has been sucessfully sent, check it out <a href={`https://rinkeby.etherscan.io/tx/${tx}`} target="_blank" rel="noopener noreferrer" style={{color: 'lightBlue'}}>here</a></>
                )
            })
}

const getPoll = async(rootContext: IRootContextType, pollId: string) => {
    try {
        return await rootContext.web3ConnectionData.pollRewardsInstance.methods.polls(pollId).call()
    }

    catch (error) {
        return null
    }
}

const getPollsLength = async(rootContext: IRootContextType) => {
    return await rootContext.web3ConnectionData.pollRewardsInstance.methods.getPollsLength().call()
}

const getOracleId = async(accountsStorageInstance: Contract, account: String) => {
    return await accountsStorageInstance.methods.addressToOracleId(account).call()
}

const getReceiverId = async(accountsStorageInstance: Contract, account: string) => {
    return await accountsStorageInstance.methods.addressToReceiverId(account).call()
}

const getOracle = async(rootContext: IRootContextType, oracleId: string) => {
    return await rootContext.web3ConnectionData.pollRewardsInstance.methods.oracles(oracleId).call()
}

const claimReceiverReward = async(rootContext: IRootContextType, pollId: string): Promise<void> => {
    await rootContext.web3ConnectionData.pollRewardsInstance.methods.claimReceiverReward(pollId).send({from: rootContext.web3ConnectionData.account})
}

const claimContributorReward = async(rootContext: IRootContextType, pollId: string): Promise<void> => {
    await rootContext.web3ConnectionData.pollRewardsInstance.methods.claimContribution(pollId).send({from: rootContext.web3ConnectionData.account})
}

const claimOracleReward = async(rootContext: IRootContextType, pollId: string): Promise<void> => {
    await rootContext.web3ConnectionData.pollRewardsInstance.methods.claimOracleReward(pollId).send({from: rootContext.web3ConnectionData.account})
}

const generateDispute = async(rootContext: IRootContextType, pollId: string): Promise<void> => {
    await rootContext.web3ConnectionData.pollRewardsInstance.methods.generateDispute(pollId).send({from: rootContext.web3ConnectionData.account})
}

const solvePoll = async(rootContext: IRootContextType, result: boolean, pollId: string): Promise<void> => {
    await rootContext.web3ConnectionData.pollRewardsInstance.methods.resolvePoll(result, pollId).send({from: rootContext.web3ConnectionData.account})
}

const contributorHasRequested = async(
    pollRewardsInstance: Contract, 
    account: string,
    pollId: string): Promise<boolean> => {
    return (await pollRewardsInstance.methods.pollsUsersContributions(pollId, account).call())[1]
}

const getGasPrice = async(web3: Web3): Promise<string> => {
    return Math.round(Number(await web3.eth.getGasPrice()) / (10 ** 9)).toString()
} 

const getAddressBalance = async(web3: Web3, address: string): Promise<string> => {
    return await web3.eth.getBalance(address)
}

const getAddressFromENS = async(web3: Web3, ensName: string): Promise<string> => {
    return await web3.eth.ens.getAddress(ensName)
}

const switchToRinkeby = async (provider: any) => {
    try {
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4'}]
        })
    }

    catch(error) {
        throw error
    }
}

const switchToArbitrumTesnetNetwork = async (provider: any) => {
    try {
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x66eeb' }],
        });
    }

    catch(error) {
        throw error
    }
}

const addArbitrumTesnetNetwork = async (provider: any) => {
    try {
        await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
                { 
                    chainId: '0x66eeb',
                    chainName: 'Arbitrum Testnet Rinkeby', 
                    nativeCurrency: {
                        name: 'Arbitrum Rinkeby Ether',
                        symbol: 'ARETH',
                        decimals: 18
                    },
                    rpcUrls: ['https://rinkeby.arbitrum.io/rpc', "wss://rinkeby.arbitrum.io/ws"],
                    blockExplorerUrls: ['https://rinkeby-explorer.arbitrum.io/#/']
                }
            ],
        });
    }

    catch (error) {
        throw error
    }
}

export {
    createReceiverAccount,
    createOracle, 
    createPoll,
    contribute,
    getPoll,
    getPollsLength,
    getOracleId,
    getReceiverId,
    getOracle,
    getPollStatus,
    claimReceiverReward,
    claimContributorReward,
    claimOracleReward,
    generateDispute,
    solvePoll,
    contributorHasRequested,
    switchToRinkeby,
    switchToArbitrumTesnetNetwork,
    addArbitrumTesnetNetwork,
    getGasPrice,
    getAddressBalance,
    getAddressFromENS
}

