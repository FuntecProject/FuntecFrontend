import React from "react"
import Link from "next/link"
import {
    createReceiverAccount,
    getReceiverId
} from '../../library/web3methods'
import styles from "../../styles/ComponentsStyles/GlobalComponentsStyles/screenerLayout.module.scss"
import { RootContext, IRootContextType } from '../GlobalComponents/screenerLayoutWrapper'
import { errorMessageWithoutClick } from "../../library/alertWindows"
import metaData from '../../public/etc/metaData.json'
import { useMediaQuery } from 'react-responsive'
import AccountButton from "./accountButton"
import ScreenMouseLock from "../GlobalComponents/screenMouseLock"

interface IMenuPanelProps {
    menuDisplayed: boolean
    closeMenuCallback: () => void
}

const MenuPanel = (props: IMenuPanelProps): React.ReactElement => {
    const rootContext: IRootContextType = React.useContext(RootContext)
    const isMobile = useMediaQuery({ maxWidth: 1200})

    const Result = () => {
        return (
            props.menuDisplayed ?
                <>
                    <div id={styles.menuPanel} style={{'right' : '10px'}}>
                        <MenuPanelElements />
                    </div>
    
                    <ScreenMouseLock 
                        backgroundShadowed={false}
                        removeDisplayedElement={props.closeMenuCallback}
                    />
                </>
            :
                <div id={styles.menuPanel}>
                    <MenuPanelElements />
                </div>
        )
    }

    const MenuPanelElements = () => {
        return isMobile ?
            <MenuPanelElementsMobile />
            :
            <MenuPanelElementsDesktop />
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

    const MenuPanelElementsDesktop = (): React.ReactElement => {
        return <MenuAcionsElements />
    }

    const SeparationBar = () => {
        return <div id={styles.menuPanelSeparateBar}></div>
    }

    const PageElement = (props: {page: string, textContent: string}) => {
        return (
            <Link href={`/${props.page}`}>
                {
                    rootContext.activePage == props.page ?
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
                    onClick={() => {
                        if (rootContext.web3ConnectionData.account != null) {
                            createReceiverAccountListener()
                        }

                        else {
                            errorMessageWithoutClick(<>Wallet not connected</>)
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

    const createReceiverAccountListener = async (): Promise<void> => {
        const reciverId = await getReceiverId(rootContext.web3ConnectionData.accountsStorageInstance, rootContext.web3ConnectionData.account)

        if (reciverId == 0) {
            await createReceiverAccount(rootContext.web3ConnectionData)
        }

        else {
            errorMessageWithoutClick(<>You can only sign up as a receiver once per account</>, 2000)
        }
    }

    return Result()
}

export default MenuPanel