import React from "react"
import Link from "next/link"
import {
    createReceiverAccount,
    getReceiverId
} from '../../library/web3methods'
import styles from "../../styles/ComponentsStyles/GlobalComponentsStyles/screenerLayout.module.scss"
import { errorMessageWithoutClick } from "../../library/alertWindows"
import metaData from '../../../public/etc/metaData.json'
import { useMediaQuery } from 'react-responsive'
import AccountButton from "./accountButton"
import ScreenMouseLock from "../GlobalComponents/screenMouseLock"
import { useAppSelector } from "../../app/hooks"
interface IMenuPanelProps {
    menuDisplayed: boolean
    closeMenuCallback: () => void
}

const MenuPanel = (props: IMenuPanelProps): React.ReactElement => {
    const isMobile = useMediaQuery({ maxWidth: 1200})
    const web3ConnectionData = useAppSelector(state => state.web3ConnectionData)
    const activePage = useAppSelector(state => state.activePage.value)

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
                    activePage == props.page ?
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
                        if (web3ConnectionData.account != null) {
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
        const reciverId = await getReceiverId(web3ConnectionData.accountsStorageInstance, web3ConnectionData.account)

        if (reciverId == 0) {
            await createReceiverAccount(web3ConnectionData.accountsStorageInstance, web3ConnectionData.account)
        }

        else {
            errorMessageWithoutClick(<>You can only sign up as a receiver once per account</>, 2000)
        }
    }

    return Result()
}

export default MenuPanel