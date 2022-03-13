import React from 'react'
import CreatePollWindow from "../../components/PollsComponents/createPollWindow"
import PollsList from '../../components/PollsComponents/pollsList'
import { IRootContextType, RootContext } from '../../components/GlobalComponents/screenerLayoutWrapper'
import ScreenerSearchAndCreate from '../../components/GlobalComponents/screenerSearchAndCreate'

interface IPollsState {
    idSearched: string
    createPollWindowDisplayed: boolean
}

export default function Polls(): React.ReactElement {
    const [idSearched, setIdSearched] = React.useState<string>('')
    const [createPollWindowDisplayed, setCreatePollWindowDisplayed] = React.useState<boolean>(false)

    let rootContext: IRootContextType = React.useContext(RootContext)

    React.useEffect(() => {
        rootContext.setActivePage("polls")
    }, [])

    return (
        <>

            <ScreenerSearchAndCreate 
                inputPlaceholder='Enter the receiver ID to see his polls or the poll ID' 
                createButtonText='Create poll' 
                idSearched={idSearched}
                setIdSearched={setIdSearched}
                setCreateWindowDisplayed={() => {setCreatePollWindowDisplayed(true)}}
            />
            
            <PollsList idSearched={idSearched} />  

            <CreatePollWindow 
                windowDisplayed={createPollWindowDisplayed} 
                closeWindow={() => {setCreatePollWindowDisplayed(false)}}
            />
        </>
    )
}

// async function getStaticProps() {
//     const client = useApolloClient()
//     let results = await client.query<IPoll[]>({query: first5PollsQuery})
// }

export type {
    IPollsState
}

