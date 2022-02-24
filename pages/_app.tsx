import '../styles/globals.css'
import React from 'react'
import ScreenerLayoutWrapper from '../components/Global components/screenerLayoutWrapper'
import Polls from "./polls"
import Oracles from "./oracles"
import ActivePolls from "./activepolls"
import welcome from "../pages/index"
import { getComponentName } from '../library/utils'
import { AppProps } from 'next/dist/shared/lib/router/router'

const MyApp = ({ Component, pageProps }: AppProps) => {
	if (Component == welcome) {
		return (
			<Component {...pageProps} />
		)
	}

	else if (
		Component == Polls ||
		Component == Oracles ||
		Component == ActivePolls 
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

export default MyApp
