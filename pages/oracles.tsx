import React from 'react'
import CreateOracleWindow from "../components/Oracle components/createOracleWindow"
import OraclesList from '../components/Oracle components/oraclesList'
import { IRootContextType, RootContext } from '../components/Global components/screenerLayoutWrapper'
import ScreenerSearchAndCreate from '../components/Global components/screenerSearchAndCreate'

interface IOraclesState {
    idSearched: string
}

const Oracles = (): React.ReactElement => {
    const [idSearched, setIdSearched] = React.useState<string>('')
    const [createOracleWindowDisplayed, setCreateOracleWindowDisplayed] = React.useState<boolean>(false)

    const rootContext: IRootContextType = React.useContext(RootContext)

    React.useEffect(() => {
        rootContext.methods.setActivePage("oracles")
    }, [])

    return (
        <>
            <ScreenerSearchAndCreate
                inputPlaceholder='Search oracle by ID address or ENS name'
                createButtonText='Create oracle'
                idSearched={idSearched}
                setIdSearched={setIdSearched}
                setCreateWindowDisplayed={() => {setCreateOracleWindowDisplayed(true)}}
            />

            <OraclesList idSearched={idSearched} />

            <CreateOracleWindow 
                windowDisplayed={createOracleWindowDisplayed}
                closeWindow={() => {setCreateOracleWindowDisplayed(false)}}
            />
        </>
    )
}

export default Oracles

export type {
    IOraclesState
}
