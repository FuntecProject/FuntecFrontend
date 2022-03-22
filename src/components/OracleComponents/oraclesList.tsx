import React, { useEffect } from "react"
import {
    first5OraclesQuery,
    IOracle,
    oracleByIdQuery
} from '../../library/graphqlQuerys'
import styles from "../../styles/ComponentsStyles/OracleComponentsStyles/oraclesList.module.scss"
import OraclesListElement from "./oraclesListElement"
import LoadingElement from "../GlobalComponents/loadingElement"
import ScreenerBox from "../GlobalComponents/screenerBox"
import { useQuery, useLazyQuery } from "@apollo/client"
import { isAddress } from "web3-utils"
import { getAddressFromENS, getOracleId } from "../../library/web3methods"
import { useAppSelector } from "../../app/hooks"

interface IOraclesListProps {
    idSearched: string
}

const OraclesList = (props: IOraclesListProps): React.ReactElement => {
    const oracles = useQuery<{oracles: IOracle[]}>(first5OraclesQuery)
    const [getOracle, oracle] = useLazyQuery<{oracle: IOracle}>(oracleByIdQuery)

    const web3ConnectionData = useAppSelector(state => state.web3ConnectionData)

    useEffect((): void => {
        if (props.idSearched != '') {
            if (isAddress(props.idSearched)) {
                getOracleId(web3ConnectionData.accountsStorageInstance, web3ConnectionData.account)
                    .then(oracleId => getOracle({variables: {id: oracleId}}))
            }
            
            else {
                if (props.idSearched.endsWith('.eth')) {                        
                    getAddressFromENS(web3ConnectionData.web3, props.idSearched)
                        .then(oracleAddress => getOracleId(web3ConnectionData.accountsStorageInstance, oracleAddress))
                        .then(oracleId => getOracle({variables: {id: oracleId}}))
                }
                else {
                    getOracle({variables: {id: props.idSearched}})
                }
            }
        }
    }, [props.idSearched])

    const Result = () => {
        return (
            <>
                <div id={styles.oraclesLegend} className="desktopView">
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

    const SearchedOracle = (): React.ReactElement => {
        if (props.idSearched != '') {
            if (oracle.loading == false && oracle.data != undefined) {
                if (oracle.data.oracle != null) {
                    return (
                        <>
                            <div className={styles.oracleTitle}>The oracle searched:</div>
                            <OraclesListElement oracleData={oracle.data.oracle} />
                        </>
                    )
                }
                
                return <div className={styles.noElementFound}>The oracle searched doesn't exist</div>
            }

            return <LoadingElement className={styles.oracleElementLoading} />
        }

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

        return <LoadingElement className={styles.oracleElementLoading} />
    }

    return Result()
}

export default OraclesList