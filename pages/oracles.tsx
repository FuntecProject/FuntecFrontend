import React from 'react'
import CreateOracleWindow from "../components/OracleComponents/createOracleWindow"
import OraclesList from '../components/OracleComponents/oraclesList'
import { IRootContextType, RootContext } from '../components/GlobalComponents/screenerLayoutWrapper'
import ScreenerSearchAndCreate from '../components/GlobalComponents/screenerSearchAndCreate'

interface IOraclesState {
    idSearched: string
}

const Oracles = (): React.ReactElement => {
    const [idSearched, setIdSearched] = React.useState<string>('')
    const [createOracleWindowDisplayed, setCreateOracleWindowDisplayed] = React.useState<boolean>(false)

    const rootContext: IRootContextType = React.useContext(RootContext)

    React.useEffect(() => {
        rootContext.setActivePage("oracles")
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
