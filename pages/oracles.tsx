import React from 'react'
import CreateOracleWindow from "../components/createOracleWindow"
import OraclesList from '../components/oraclesList'
import { IRootContextType, RootContext } from '../components/screenerLayoutWrapper'
import ScreenerSearchAndCreate from '../components/screenerSearchAndCreate'

interface IOraclesState {
    idSearched: string
}

export default function Oracles(): React.ReactElement {
    const [state, setState] = React.useState<IOraclesState>({
        idSearched: ''
    })

    const rootContext: IRootContextType = React.useContext(RootContext)

    React.useEffect(() => {
        rootContext.methods.setActivePage("oracles")
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
                inputPlaceholder='Search oracle by ID address or ENS name'
                createButtonText='Create oracle'
                idSearched={state.idSearched}
                setIdSearched={setIdSearched}
            />

            <OraclesList parentState={state} />

            <CreateOracleWindow />
        </>
    )
}

export type {
    IOraclesState
}
