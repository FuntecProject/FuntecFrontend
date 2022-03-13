import React from 'react'
import styles from './../../styles/ComponentsStyles/PollsComponentsStyles/pollScreenerLegend.module.scss'

const PollScreenerLegend = (): React.ReactElement => {
    return (
        <div id={styles.pollScreenerLegend} className="desktopView">
            <div>Poll ID</div>
            <div>State</div>
            <div>Result</div>
            <div>Total contribution</div>
            <div>Date limit</div>
            <div>Receiver ID</div>
            <div>Oracle ID</div>
        </div> 
    )
}

export default PollScreenerLegend