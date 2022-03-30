import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/dist/client/image'
import styles from '../styles/PagesStyles/index.module.scss'
import metaData from '../../public/etc/metaData.json'
import React from 'react'
import EthereumColoredIcon from '../../public/images/ethereumColored.svg'

declare let window: any

const Welcome = (): React.ReactElement => {
    const Result = () => {
        return (
            <>
                <Head>
                    <title>Welcome to funtec!</title>
                </Head>

                <MobileVersion />

                <DesktopVersion />
            </>
        )
    }

    const DesktopVersion = () => {
        return (
            <div className={`${styles.main} desktopView`}>
                <div id={styles.navElements}>
                    <div id={styles.navLeftSide}>
                        <Link href={"/"}>
                            <div id={styles.home} className={styles.navElement}>
                                <Image src="/images/appIcon.svg" alt="App icon" width={30} height={30}></Image>
                            </div>
                        </Link>
                        
                        <Link href={"/polls"}>
                            <div id={styles.polls} className={styles.navElement}>Enter app
                                <div className={styles.navElementSurline}></div>
                            </div>
                        </Link>
                        <div 
                            id={styles.oracles} 
                            className={styles.navElement}
                            onClick={() => {window.open(metaData.docsUrl, "_blank")}}
                        >User guide
                            <div className={styles.navElementSurline}></div>
                        </div>
                        <div 
                            id={styles.activePolls} 
                            className={styles.navElement}
                            onClick={() => {window.open(metaData.githubUrl, "_blank")}}
                        >Explore source code
                            <div className={styles.navElementSurline}></div>
                        </div>
                    </div>
                </div>

                <div id={styles.body}>
                    <div id={styles.firstView}>
                        <div id={styles.leftView}>
                            <div id={styles.leftViewHeader}>
                                <h1 id={styles.title}>Welcome to Funtec!</h1>
                                <p id={styles.subTitle}>Here we help you <span className={styles.boldText}>get the videos, streams, books that you want</span> by allowing you to incentivise creators to produce specific content in a decentralized way!</p>
                                <div id={styles.firstViewButtons}>
                                    <Link href={"/polls"}>
                                        <input type={"button"} value={"Enter app"} id={styles.enterAppButton}></input>
                                    </Link>
                                    <div onClick={() => {window.open(metaData.docsUrl, "_blank")}}>
                                        <input type={"button"} value={"Learn how to use"}></input>
                                    </div>
                                </div>

                                <EthNetworkMessage />
                            </div>
                        </div>
                        <div id={styles.firstViewSvg}>
                            <img src="/images/welcomePageRigthImage.svg" alt='Persong staring at blockchain ecosystem'></img>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const MobileVersion = () => {
        return (
            <div className={`${styles.bodyMobile} mobileView`}>
                    <div id={styles.firstViewMobile}>
                        <h1 id={styles.titleMobile}>Welcome to Funtec!</h1>
                        <p id={styles.subTitleMobile}>Here we help you <span className={styles.boldText}>get the videos, streams, books that you want</span> by allowing you to incentivise creators to produce specific content in a decentralized way!</p>
                        <div id={styles.firstViewButtonsMobile}>
                            <Link href={"/polls"}>
                                <input type={"button"} value={"Enter app"} id={styles.enterAppButton}></input>
                            </Link>     

                            <input type={"button"} value={"Learn how to use"} onClick={() => {window.open(metaData.docsUrl, "_blank")}}></input>
                        </div>           
                    </div>
            </div>
        )
    }

    const EthNetworkMessage = () => {
        return (
            <div id={styles.ethNetworkMessage}>
                <div>Built upon the Ethereum network</div>
                <EthereumColoredIcon style={{'width': '30px'}}/>
            </div>
        )
    }

    return Result()
}

export default Welcome

