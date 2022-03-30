import React from "react"
import styles from "./../../styles/ComponentsStyles/OracleComponentsStyles/oraclesListElement.module.scss"
import { 
    getDaysAndHoursFromUnix,
    converGWeiToEth,
    getTwoDecimalPercent
} from "../../library/utils"
import { IOracle } from "../../library/graphqlQuerys"
import { fromWei } from "web3-utils"


interface IOraclesListElementProps {
    oracleData: IOracle
}

const OraclesListElement = (props: IOraclesListElementProps): React.ReactElement => {
    const Result = () => {
        return (
            <>
                <MobileVersion />
                <DesktopVersion />
            </>
        )
    }

    const MobileVersion = () => {
        return (
            <div className={`${styles.oracleElementMobile} mobileView`}>
                <div id={styles.oracleElementIdMobile}>
                    #{props.oracleData.id}
                </div>

                <div id={styles.firstOracleElementMobile} className={styles.oracleElementRowMobile}>
                    <div>Response time</div>
                    <div>{getDaysAndHoursFromUnix(props.oracleData.responseTime)}</div>
                </div>

                <div className={styles.oracleElementRowMobile}>
                    <div>Oracle fee</div>
                    <div>{converGWeiToEth(props.oracleData.oracleFee)} ETH</div>
                </div>

                <div className={styles.oracleElementRowMobile}>
                    <div>Amount managed</div>
                    <div>{fromWei(props.oracleData.amountManaged)} ETH</div>
                </div>

                <div className={styles.oracleElementRowMobile}>
                    <div>Success rate</div>
                    <div>{getTwoDecimalPercent((Number(props.oracleData.numberPollsHandled) - Number(props.oracleData.numberPollsWrong)), props.oracleData.numberPollsHandled)}</div>
                </div>

                <div className={styles.oracleElementRowMobile}>
                    <div>Number polls wrong</div>
                    <div>{props.oracleData.numberPollsWrong}</div>
                </div>

                <div className={styles.oracleElementRowMobile}>
                    <div>Number polls handled</div>
                    <div>{props.oracleData.numberPollsHandled}</div>
                </div>
            </div>
        )
    }

    const DesktopVersion = () => {
        return (
            <div className={`${styles.oracleElement} desktopView`}>
                <div>#{props.oracleData.id}</div>
                <div>{getDaysAndHoursFromUnix(props.oracleData.responseTime)}</div>
                <div>{converGWeiToEth(props.oracleData.oracleFee)} ETH</div>
                <div>{fromWei(props.oracleData.amountManaged)} ETH</div>
                <div>{getTwoDecimalPercent((Number(props.oracleData.numberPollsHandled) - Number(props.oracleData.numberPollsWrong)), props.oracleData.numberPollsHandled)}</div>
                <div>{props.oracleData.numberPollsWrong}</div>
                <div>{props.oracleData.numberPollsHandled}</div>
            </div>
        )
    }

    return Result()
}

export default OraclesListElement