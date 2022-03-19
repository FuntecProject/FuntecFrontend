import React from 'react'
import CreatePollWindow from "../../components/PollsComponents/createPollWindow"
import PollsList from '../../components/PollsComponents/pollsList'
import ScreenerSearchAndCreate from '../../components/GlobalComponents/screenerSearchAndCreate'
import { useAppDispatch } from '../app/hooks'
import { setActivePage } from '../features/activePageSlide'

interface IPollsState {
    idSearched: string
    createPollWindowDisplayed: boolean
}

export default function Polls(): React.ReactElement {
    const [idSearched, setIdSearched] = React.useState<string>('')
    const [createPollWindowDisplayed, setCreatePollWindowDisplayed] = React.useState<boolean>(false)

    const dispatch = useAppDispatch()

    React.useEffect(() => {
        dispatch(setActivePage("polls"))
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

