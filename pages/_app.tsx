import '../styles/globals.css'
import React from 'react'
import ScreenerLayoutWrapper from '../components/screenerLayoutWrapper'
import polls from "../pages/polls"
import oracles from "../pages/oracles"
import activePolls from "../pages/activepolls"
import welcome from "../pages/index"

interface IMyAppProps {
	Component: React.FunctionComponent
}

export default function MyApp({ Component }: IMyAppProps) {
	if (Component == welcome) {
		return (
			<Component />
		)
	}

	else if (
		Component == polls ||
		Component == oracles ||
		Component == activePolls 
	) 
	
	{
		return (
			<>
				<ScreenerLayoutWrapper wrappedComponent={Component}></ScreenerLayoutWrapper>
			</>
		)
	}	
	
	else {
		return <>The page doesnt exist</>
	}
}


