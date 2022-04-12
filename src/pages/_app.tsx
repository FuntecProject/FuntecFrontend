import '../styles/PagesStyles/globals.css'
import React from 'react'
import ScreenerLayoutWrapper from '../components/GlobalComponents/screenerLayoutWrapper'
import Polls from "./polls"
import Oracles from "./oracles"
import ActivePolls from "./activepolls"
import Welcome from "../pages/index"
import { AppProps } from 'next/dist/shared/lib/router/router'
import { Provider } from 'react-redux'
import store from "../../src/app/store"

const MyApp = ({ Component, pageProps }: AppProps) => {
	if (Component == Welcome) {
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
                <ScreenerLayoutWrapper>
                    <Component {...pageProps} />
                </ScreenerLayoutWrapper>
            </Provider>
		)
	}	
	
	return <>The page doesnt exist</>
}

export default MyApp
