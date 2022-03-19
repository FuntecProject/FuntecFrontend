import '../../styles/PagesStyles/globals.css'
import React from 'react'
import ScreenerLayoutWrapper from '../../components/GlobalComponents/screenerLayoutWrapper'
import Polls from "./polls"
import Oracles from "./oracles"
import ActivePolls from "./activepolls"
import welcome from "../pages/index"
import { getComponentName } from '../../library/utils'
import { AppProps } from 'next/dist/shared/lib/router/router'
import { Provider } from 'react-redux'
import store from "../../src/app/store"

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
	) {
		return (
            <Provider store={store}>
                <ScreenerLayoutWrapper title={getComponentName(Component)}>
                    <Component {...pageProps} />
                </ScreenerLayoutWrapper>
            </Provider>
		)
	}	
	
	return <>The page doesnt exist</>
}

export default MyApp
