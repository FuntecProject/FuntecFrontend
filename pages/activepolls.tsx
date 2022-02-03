import React from 'react'
import { IRootContextType, RootContext } from '../components/screenerLayoutWrapper'
import ActivePollsList from '../components/activePollsList'


export default function ActivePolls(): React.ReactElement {
    const rootContext: IRootContextType = React.useContext(RootContext)

    React.useEffect(() => {
        rootContext.methods.setActivePage("activepolls")
    }, [])
    
    return (
        <>
            <ActivePollsList />
        </>
    )
}