import * as IPFS from 'ipfs-core'
import MetaData from "../public/etc/metaData.json"

let options: any = {
    host: 'ipfs.infura.io', 
    port: '5001', 
    apiPath: '/api/v0' 
}

let client: IPFS.IPFS | null = null

const createIpfsInstance = async () => {
    if (client == null) {
        client = await IPFS.create(options)
    }
}

const addStringToIPFS = async (string: string): Promise<string | null> => {
    if (client != null) {
        try {
            let response = await client.add(string)

            return response['path']
        }
    
        catch(err) {
            console.log(err)
    
            return null
        }
    }

    await createIpfsInstance()
    return await addStringToIPFS(string)
}

const getDescriptionFromHash = async (hash:string): Promise<string> => {
    let response = await fetch(`${MetaData.infuraIPFSGateway}/${hash}`)
    
    return response.text()
}

export {
    addStringToIPFS,
    getDescriptionFromHash
}