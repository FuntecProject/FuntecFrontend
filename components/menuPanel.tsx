import React from "react"
import Link from "next/link"
import {
    createReceiverAccount,
    getReceiverId
} from '../library/web3methods'
import styles from "../styles/screenerLayout.module.scss"
import { RootContext, IRootContextType } from './screenerLayoutWrapper'
import { errorMessageWithoutClick } from "../library/alertWindows"
import metaData from '../public/etc/metaData.json'
import { useMediaQuery } from 'react-responsive'
import AccountButton from "./accountButton"

export default function MenuPanel(): React.ReactElement {
    const rootContext: IRootContextType = React.useContext(RootContext)
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })

    const createReceiverAccountListener = async (): Promise<void> => {
        const reciverId = await getReceiverId(rootContext.state.accountsStorageInstance, rootContext.state.account)

        if (reciverId == 0) {
            await createReceiverAccount(rootContext.state)
        }

        else {
            errorMessageWithoutClick(rootContext.state.MySwal, <>You can only sign up as a receiver once per account</>, 2000)
        }
    }

    const SeparationBar = () => {
        return <div id={styles.menuPanelSeparateBar}></div>
    }

    const PageElement = (props: {page: string, textContent: string}) => {
        return (
            <Link href={`/${props.page}`}>
                {
                    rootContext.state.activePage == props.page ?
                        <div className={styles.pageElement} style={{fontWeight: 'bold'}}>
                            {props.textContent}
                        </div>
                        :
                        <div className={styles.pageElement}>
                        {props.textContent}
                    </div>
                }
            </Link>
        )
    }

    const MenuAcionsElements = () => {
        return (
            <>
                <div 
                    className={styles.menuElement}
                    onClick={async () => {
                        if (rootContext.state.account != null) {
                            await createReceiverAccountListener()
                        }

                        else {
                            errorMessageWithoutClick(rootContext.state.MySwal, <>Wallet not connected</>)
                        }
                    }}
                >Sing Up as a receiver</div>

                <div
                    className={styles.menuElement} 
                    onClick={() => window.open(metaData.docsUrl, "_blank")}
                >User guide</div>

                <div 
                    className={styles.menuElement}
                    onClick={() => window.open(metaData.githubUrl, "_blank")}
                >Explore our source code</div>
            </>
        )
    }

    const MenuPanelElementsDesktop = (): React.ReactElement => {
        return <MenuAcionsElements />
    }

    const MenuPanelElementsMobile = () => {
        return (
            <>
                <div id={styles.menuElementAccountButton}>
                    <AccountButton />
                </div>

                <SeparationBar />

                <div id={styles.pageElementsMobile}>
                    <PageElement page="polls" textContent="Polls" />
                    <PageElement page="oracles" textContent="Oracles" />
                    <PageElement page="activepolls" textContent="Active polls" />
                </div>

                <SeparationBar />

                <div style={{height: '20px'}}></div>

                <MenuAcionsElements />
            </>
        )
    }

    const MenuPanelElements = () => {
        if (isDesktopOrLaptop) {
            return <MenuPanelElementsDesktop />
        }

        return <MenuPanelElementsMobile />
    }

    return (
        rootContext.state.menuDisplayed ?
            <div id={styles.menuPanel} style={{'transform' : 'translateX(0px)'}}>
                <MenuPanelElements />
            </div>
        :
            <div id={styles.menuPanel}>
                <MenuPanelElements />
            </div>
    )
}
