import { getPollStatus } from "./utils"
import { addStringToIPFS } from "./ipfsQuerys"
import BigNumber from "bignumber.js"
import { sucessMessageWithclick } from "./alertWindows"
import { Contract } from "web3-eth-contract"
import Web3 from "web3"

const createReceiverAccount = async (accountsStorageInstance: Contract, account: string): Promise<void> => {
    accountsStorageInstance.methods.createReceiverAccount().send({from: account})
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
    accountsStorageInstance: Contract,
    account: string,
    responseTime: Number,
    fee: BigNumber
) => {
    accountsStorageInstance.methods.createNewOracle(responseTime.toString(), fee.toString()).send({from: account})
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
    pollRewardsInstance: Contract,
    account: string,
    receiverId: number,
    oracleId: number,
    dateLimit: number,
    amount: number,
    requirement: string
): Promise<void> => {
    let hash = await addStringToIPFS(requirement)

    if (hash) {
        pollRewardsInstance.methods.createPoll(receiverId.toString(), dateLimit.toString(), oracleId.toString(), hash).send({from: account, value: amount})
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
    pollRewardsInstance: Contract,
    account: string,
    pollId: string,
    amount: string
): Promise<void> => {
    pollRewardsInstance.methods.contribute(pollId).send({from: account, value: amount})
            .on('error', (e: string) => {
                console.log(e)
            })
            .on('transactionHash', (tx: string) => {
                sucessMessageWithclick(
                    <>Transaction has been sucessfully sent, check it out <a href={`https://rinkeby.etherscan.io/tx/${tx}`} target="_blank" rel="noopener noreferrer" style={{color: 'lightBlue'}}>here</a></>
                )
            })
}

const getPoll = async(pollRewardsInstance: Contract, pollId: string) => {
    try {
        return await pollRewardsInstance.methods.polls(pollId).call()
    }

    catch (error) {
        return null
    }
}

const getPollsLength = async(pollRewardsInstance: Contract) => {
    return await pollRewardsInstance.methods.getPollsLength().call()
}

const getOracleId = async(accountsStorageInstance: Contract, account: String) => {
    return await accountsStorageInstance.methods.addressToOracleId(account).call()
}

const getReceiverId = async(accountsStorageInstance: Contract, account: string) => {
    return await accountsStorageInstance.methods.addressToReceiverId(account).call()
}

const getOracle = async(pollRewardsInstance: Contract, oracleId: string) => {
    return await pollRewardsInstance.methods.oracles(oracleId).call()
}

const claimReceiverReward = async(pollRewardsInstance: Contract, account: string, pollId: string): Promise<void> => {
    await pollRewardsInstance.methods.claimReceiverReward(pollId).send({from: account})
}

const claimContributorReward = async(pollRewardsInstance: Contract, account: string, pollId: string): Promise<void> => {
    await pollRewardsInstance.methods.claimContribution(pollId).send({from: account})
}

const claimOracleReward = async(pollRewardsInstance: Contract, account: string, pollId: string): Promise<void> => {
    await pollRewardsInstance.methods.claimOracleReward(pollId).send({from: account})
}

const generateDispute = async(pollRewardsInstance: Contract, account: string, pollId: string): Promise<void> => {
    await pollRewardsInstance.methods.generateDispute(pollId).send({from: account})
}

const solvePoll = async(pollRewardsInstance: Contract, account: string, result: boolean, pollId: string): Promise<void> => {
    await pollRewardsInstance.methods.resolvePoll(result, pollId).send({from: account})
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

