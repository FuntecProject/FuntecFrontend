import React from 'react'
import CreateOracleWindow from "../components/OracleComponents/createOracleWindow"
import OraclesList from '../components/OracleComponents/oraclesList'
import ScreenerSearchAndCreate from '../components/GlobalComponents/screenerSearchAndCreate'
import { useAppDispatch } from '../app/hooks'
import { setActivePage } from '../features/activePageSlide'
import Head from 'next/head'

interface IOraclesState {
    idSearched: string
}

const Oracles = (): React.ReactElement => {
    const [idSearched, setIdSearched] = React.useState<string>('')
    const [createOracleWindowDisplayed, setCreateOracleWindowDisplayed] = React.useState<boolean>(false)

    const dispatch = useAppDispatch()

    React.useEffect(() => {
        dispatch(setActivePage("oracles"))
    }, [])

    return (
        <>
            <Head>
                <title>Oracles</title>
            </Head>

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
