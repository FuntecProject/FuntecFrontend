import React, { useEffect } from "react"
import {
    IOracle,
    getOracleQuery
} from '../library/graphqlQuerys'
import styles from "../styles/oraclesList.module.scss"
import OraclesListElement from "./oraclesListElement"
import { IOraclesState } from "../pages/oracles"
import LoadingElement from "./loadingElement"
import ScreenerBox from "./screenerBox"
import { useQuery, gql, useLazyQuery } from "@apollo/client"
import { oraclesQuery } from "./../library/graphqlQuerys"
import { useMediaQuery } from "react-responsive"
import { isAddress } from "web3-utils"
import { getAddressFromENS, getOracleId } from "../library/web3methods"
import { RootContext, IRootContextType } from './screenerLayoutWrapper'

interface IOraclesListProps {
    parentState: IOraclesState
}

export default function OraclesList(props: IOraclesListProps): React.ReactElement {
    const rootContext: IRootContextType = React.useContext(RootContext)
    const oracles = useQuery<{oracles: IOracle[]}>(oraclesQuery)
    const [getOracle, oracle] = useLazyQuery<{oracle: IOracle}>(getOracleQuery)

    const isMobile = useMediaQuery({ maxWidth: 1200})

    useEffect((): void => {
        const callback = async () => {
            if (props.parentState.idSearched != '') {
                if (isAddress(props.parentState.idSearched)) {
                    let oracleId = await getOracleId(rootContext.state.accountsStorageInstance, rootContext.state.account)

                    getOracle({variables: {id: oracleId}})
                }

                else {
                    if (props.parentState.idSearched.endsWith('.eth')) {                        
                        let oracleAddress = await getAddressFromENS(rootContext.state.web3, props.parentState.idSearched)
                        let oracleId = await getOracleId(rootContext.state.accountsStorageInstance, oracleAddress)

                        getOracle({variables: {id: oracleId}})
                    }

                    else {
                        getOracle({variables: {id: props.parentState.idSearched}})
                    }
                }
            }
        }

        callback()
    }, [props.parentState.idSearched])

    const SearchedOracle = (): React.ReactElement => {
        if (props.parentState.idSearched != '') {
            if (oracle.loading == false && oracle.data != undefined) {
                if (oracle.data.oracle != null) {
                    return (
                        <>
                            <div className={styles.oracleTitle}>The oracle searched:</div>
                            <OraclesListElement oracleData={oracle.data.oracle} />
                        </>
                    )
                }
                
                else {
                    return <div className={styles.noElementFound}>The oracle searched doesn't exist</div>
                }
            }

            else {
                return <LoadingElement className={styles.oracleElementLoading} />
            }
        }

        else {
            if (oracles.data) {
                const allOracles = oracles.data.oracles.map(oracle => {
                    return <OraclesListElement key={oracle.id} oracleData={oracle} /> 
                })

                return (
                    <>
                        <div className={styles.oracleTitle}>All oracles available:</div>
                        {allOracles}
                    </>
                )
            }

            else {
                return <LoadingElement className={styles.oracleElementLoading} />
            }
        }
    }

    const DesktopVersion = () => {
        return (
            <>
                <div id={styles.oraclesLegend}>
                    <div>Oracle ID</div>
                    <div>Response time</div>
                    <div>Oracle fee</div>
                    <div>Amount managed</div>
                    <div>Success rate</div>
                    <div>Number polls wrong</div>
                    <div>Number polls handled</div>
                </div>

                <ScreenerBox>
                    <SearchedOracle />
                </ScreenerBox>
            </>
        )
    }

    const MobileVersion = () => {
        return (
            <>
                <ScreenerBox>
                    <SearchedOracle />
                </ScreenerBox>
            </>
        )
    }

    return(
        isMobile ?
            <MobileVersion />
            :
            <DesktopVersion />
    )
}