import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import GasIcon from "./../../public/images/gasIcon.svg"
import BellIcon from "./../../public/images/bellIcon.svg"
import CrossIcon from "./../../public/images/crossIcon.svg"
import SettingsIcon from "../../public/images/settings.svg"
import styles from "./../../styles/ComponentsStyles/NavbarComponentsStyles/screenerNavbar.module.scss"
import { RootContext, IRootContextType } from '../GlobalComponents/screenerLayoutWrapper'
import { getGasPrice } from '../../library/web3methods'
import AccountButton from './accountButton'
import MenuPanel from './menuPanel'
import SettingsWindow from './settingsWindow'


const ScreenerNavbar = (): React.ReactElement => {
    const [gasPrice, setGasPrice] = React.useState<string>('N/A')
    const [menuDisplayed, setMenuDisplayed] = React.useState<boolean>(false)
    const rootContext: IRootContextType = React.useContext(RootContext)

    React.useEffect(() => {
        if (rootContext.web3ConnectionData.web3 != null) {
            getGasPrice(rootContext.web3ConnectionData.web3)
                .then(gasPrice => {
                    setGasPrice(gasPrice)
                })
        }
    }, [rootContext.web3ConnectionData])

    const Result = () => {
        return (
            <>
                <MobileNavBar />
                <DesktopNavbar />
                <MenuPanel menuDisplayed={menuDisplayed} closeMenuCallback={() => {setMenuDisplayed(false)}} />
            </>
        )
    }

    const MobileNavBar = (): React.ReactElement => {
        return (
            <div id={styles.navMobile} className="mobileView">
                <Link href="/">
                    <a id={styles.home}>
                        <Image src="/images/appIcon.svg" alt="App icon" width={30} height={30} />
                    </a>
                </Link>

                <MenuButtonElement />
            </div>
        )
    }

    const DesktopNavbar = (): React.ReactElement => {
        return (
            <div id={styles.nav} className="desktopView">
                <div id={styles.navElements}>
                    <div id={styles.navLeftSide}>
                        <Link href="/">
                            <a id={styles.home} className={styles.navElement}>
                                <Image src="/images/appIcon.svg" alt="App icon" width={30} height={30} />
                            </a>
                        </Link>

                        <NavElement textContent="Polls" page="polls" />
                        <NavElement textContent="Oracles" page="oracles" />
                        <NavElement textContent="Active Polls" page="activepolls" />
                    </div> 

                    <div id={styles.navRigthSide}>
                        <SettingsElements />

                        <div id={styles.gasPanel} title='Current gas price on the network'>
                            <GasIcon />
                            <div id={styles.gasPrice}>{gasPrice}</div>
                        </div>  

                        <div id={styles.notificationsPanel}></div>  

                        <AccountButton />    

                        <BellIcon id={styles.bellIcon} />

                        <MenuButtonElement />
                    </div>
                </div>
            </div>
        )
    }

    const SettingsElements = (): React.ReactElement => {
        const [settingsDisplayed, setSettingsDisplayed] = React.useState<boolean>(false)

        return (
            <div id={styles.settingsBox}>
                <SettingsIcon id={styles.settingsIcon} onClick={() => {setSettingsDisplayed(true)}} />
                <SettingsWindow displayed={settingsDisplayed} closeSettingsCallback={() => {setSettingsDisplayed(false)}} />
            </div>
        )
    }

    const NavElement = (props: {page: string, textContent: string}) => {
        return (
            <Link href={`/${props.page}`}>
                <a className={styles.navElement} >
                    {props.textContent}   
                    
                    {
                    rootContext.activePage == props.page ?
                        <div className={`${styles.navElementSurline} ${styles.active}`}></div> 
                        :
                        <div className={styles.navElementSurline}></div>
                    }
                </a>
            </Link>
        )
    }

    const MenuButtonElement = (): React.ReactElement => {
        return menuDisplayed ?
            <CrossIcon style={{marginRight: '20px'}}/>
            :
            <div onClick={() => {setMenuDisplayed(true)}} id={styles.menuIcon}>
                <div></div>
                <div></div>
                <div></div>
            </div>
    }

    return Result()
}

export default ScreenerNavbar



