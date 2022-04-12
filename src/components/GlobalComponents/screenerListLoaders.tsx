import React from "react"
import ContentLoader from 'react-content-loader'


const ScreenerElementLoader = () => {
    return (
        <ContentLoader height={50} width={2000} speed={0.8} style={{
            position: 'relative',
            width: '95%',
            marginTop: '20px',
            marginLeft: '2.5%'
            }}>
            <rect x="0" y="0" rx="4" ry="4" width="100%" height="100%" />
        </ContentLoader>
    )
}

const ScreenerElementLoaderRepeated = () => {
    return (
        <>
            <ScreenerElementLoader />
            <ScreenerElementLoader />
            <ScreenerElementLoader />
            <ScreenerElementLoader />
            <ScreenerElementLoader />
        </>
    )
}

export {
    ScreenerElementLoader,
    ScreenerElementLoaderRepeated
}