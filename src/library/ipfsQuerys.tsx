import MetaData from "../../public/etc/metaData.json"

// let options: any = {
//     host: 'ipfs.infura.io', 
//     port: '5001', 
//     apiPath: '/api/v0' 
// }

// let client: IPFS.IPFS | null = null

// const createIpfsInstance = async () => {
//     if (client == null) {
//         client = await IPFS.create(options)
//     }
// }

// const addStringToIPFS = async (string: string): Promise<string | null> => {
//     if (client != null) {
//         try {
//             let response = await client.add(string)

//             return response['path']
//         }
    
//         catch(err) {
//             console.log(err)
    
//             return null
//         }
//     }

//     await createIpfsInstance()
//     return await addStringToIPFS(string)
// }

const addStringToIPFS = async (string: string): Promise<string | null> => {
    try {
        let addResponse = await fetch(`${MetaData.ipfsPiningServiceUrl}/api/AddFile?filecontent=${string}`)
        
        if (addResponse.ok) {
            let hash = await addResponse.text()
            let pinResponse = await fetch(`${MetaData.ipfsPiningServiceUrl}/api/PinFile?hash=${hash}`)

            if (pinResponse.ok) {
                return hash
            }
        }

        return null
    }

    catch {
        return null
    }
}

const getDescriptionFromHash = async (hash:string): Promise<string> => {
    let response = await fetch(`${MetaData.infuraIPFSGateway}/${hash}`)
    
    if (response.ok) {
        return await response.text()
    }

    return null
}

export {
    addStringToIPFS,
    getDescriptionFromHash
}