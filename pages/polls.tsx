import React from 'react'
import CreatePollWindow from "../components/createPollWindow"
import PollsList from '../components/pollsList'
import { IRootContextType, RootContext } from '../components/screenerLayoutWrapper'
import ScreenerSearchAndCreate from '../components/screenerSearchAndCreate'

interface IPollsState {
    idSearched: string
}

export default function Polls(): React.ReactElement {
    const [state, setState] = React.useState<IPollsState>({
        idSearched: ''
    })

    let rootContext: IRootContextType = React.useContext(RootContext)

    React.useEffect(() => {
        rootContext.methods.setActivePage("polls")
    }, [])

    const setIdSearched = (idSearched: string) => {
        setState(prevState => ({
            ...prevState,
            idSearched: idSearched
        }))
    }

    return (
        <>

            <ScreenerSearchAndCreate 
                inputPlaceholder='Enter the receiver ID to see his polls or the poll ID' 
                createButtonText='Create poll' 
                idSearched={state.idSearched}
                setIdSearched={setIdSearched}
            />
            
            <PollsList parentState={state} />  

            <CreatePollWindow />
        </>
    )
}

export type {
    IPollsState
}

