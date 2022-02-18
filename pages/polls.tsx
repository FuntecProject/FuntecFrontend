import React from 'react'
import CreatePollWindow from "../components/Polls components/createPollWindow"
import PollsList from '../components/Polls components/pollsList'
import { IRootContextType, RootContext } from '../components/Global components/screenerLayoutWrapper'
import ScreenerSearchAndCreate from '../components/Global components/screenerSearchAndCreate'

interface IPollsState {
    idSearched: string
    createPollWindowDisplayed: boolean
}

export default function Polls(): React.ReactElement {
    const [idSearched, setIdSearched] = React.useState<string>('')
    const [createPollWindowDisplayed, setCreatePollWindowDisplayed] = React.useState<boolean>(false)

    let rootContext: IRootContextType = React.useContext(RootContext)

    React.useEffect(() => {
        rootContext.methods.setActivePage("polls")
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

export type {
    IPollsState
}

