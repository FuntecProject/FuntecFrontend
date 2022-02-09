import '../styles/globals.css'
import React from 'react'
import ScreenerLayoutWrapper from '../components/screenerLayoutWrapper'
import polls from "../pages/polls"
import oracles from "../pages/oracles"
import activePolls from "../pages/activepolls"
import welcome from "../pages/index"
import { getComponentName } from '../library/utils'
import { AppProps } from 'next/dist/shared/lib/router/router'


export default function MyApp({ Component, pageProps }: AppProps) {
	if (Component == welcome) {
		return (
			<Component {...pageProps} />
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
				<ScreenerLayoutWrapper title={getComponentName(Component)}>
					<Component {...pageProps} />
				</ScreenerLayoutWrapper>
			</>
		)
	}	
	
	else {
		return <>The page doesnt exist</>
	}
}


