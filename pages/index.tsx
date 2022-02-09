import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/dist/client/image'
import styles from '../styles/index.module.scss'
import metaData from '../public/etc/metaData.json'
import { useMediaQuery } from "react-responsive"
import { GetServerSideProps } from 'next'
import isMobile from 'ismobilejs'
import React from 'react'

declare let window: any

interface IWelcomeProps {
    userAgent: string
}

const Welcome = ({ userAgent }: IWelcomeProps): React.ReactElement => {
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })
    const isServer = (typeof window === 'undefined')? false : true

    const DesktopVersion = () => {
        return (
                <main id={styles.main}>
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
                                    <p id={styles.subTitle}>Here we help you <span className={styles.boldText}>get the content that you want</span> by allowing you to contribute to incentivise content creators to produce specific content.</p>
                                    <div id={styles.firstViewButtons}>
                                        <Link href={"/polls"}>
                                            <input type={"button"} value={"Enter app"} id={styles.enterAppButton}></input>
                                        </Link>

                                        <div onClick={() => {window.open(metaData.docsUrl, "_blank")}}>
                                            <input type={"button"} value={"Learn how to use"}></input>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id={styles.firstViewSvg}>
                                <img src="/images/welcomePageRigthImage.svg"></img>
                            </div>
                        </div>
                    </div>
                </main>
        )
    }

    const MobileVersion = () => {
        return (
                <div id={styles.bodyMobile}>
                    <div id={styles.firstViewMobile}>
                        <h1 id={styles.titleMobile}>Welcome to Funtec!</h1>
                        <p id={styles.subTitleMobile}>Here we help you <span className={styles.boldText}>get the content that you want</span> by allowing you to contribute to incentivise content creators to produce specific content.</p>
                        <div id={styles.firstViewButtonsMobile}>
                            <Link href={"/polls"}>
                                <input type={"button"} value={"Enter app"} id={styles.enterAppButton}></input>
                            </Link>             
                            <div onClick={() => {window.open(metaData.docsUrl, "_blank")}}>
                                <input type={"button"} value={"Learn how to use"}></input>
                            </div>
                        </div>           
                    </div>
                </div>
        )
    }

    return (
        <div>
            <Head>
                <title>Welcome to funtec!</title>
                <link rel="icon" type="image/x-icon" href="/images/appIcon.svg"></link>
            </Head>

            {
                isServer ?
                    isMobile(userAgent).any ?
                        <MobileVersion />
                        :
                        <DesktopVersion />
                    :
                    isDesktopOrLaptop ?
                        <DesktopVersion />
                        :
                        <MobileVersion />
                    
            }
        </div>
    )
}

const getServerSideProps: GetServerSideProps = async (context) => {
    let userAgent = context.req.headers["user-agent"]

    return {
        props: { userAgent: userAgent }
    }
}

export default Welcome

export {
    getServerSideProps
}

