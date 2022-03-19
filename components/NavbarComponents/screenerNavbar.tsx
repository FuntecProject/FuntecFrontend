import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import GasIcon from "./../../public/images/gasIcon.svg"
import BellIcon from "./../../public/images/bellIcon.svg"
import CrossIcon from "./../../public/images/crossIcon.svg"
import SettingsIcon from "../../public/images/settings.svg"
import styles from "./../../styles/ComponentsStyles/NavbarComponentsStyles/screenerNavbar.module.scss"
import { getGasPrice } from '../../library/web3methods'
import AccountButton from './accountButton'
import MenuPanel from './menuPanel'
import SettingsWindow from './settingsWindow'
import { useAppSelector } from '../../src/app/hooks'


const ScreenerNavbar = (): React.ReactElement => {
    const [gasPrice, setGasPrice] = React.useState<string>('N/A')

    const activePage = useAppSelector(state => state.activePage.value)
    const web3ConnectionData = useAppSelector(state => state.web3ConnectionData)

    React.useEffect(() => {
        if (web3ConnectionData.web3 != null) {
            getGasPrice(web3ConnectionData.web3)
                .then(gasPrice => {
                    setGasPrice(gasPrice)
                })
        }
    }, [web3ConnectionData])

    const Result = () => {
        return (
            <>
                <MobileNavBar />
                <DesktopNavbar />
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
                    activePage == props.page ?
                        <div className={`${styles.navElementSurline} ${styles.active}`}></div> 
                        :
                        <div className={styles.navElementSurline}></div>
                    }
                </a>
            </Link>
        )
    }

    const MenuButtonElement = (): React.ReactElement => {
        const [menuDisplayed, setMenuDisplayed] = React.useState<boolean>(false)

        return (
            <>
                {
                menuDisplayed ?
                    <CrossIcon style={{marginRight: '20px'}} />
                    :
                    <div onClick={() => {setMenuDisplayed(true)}} id={styles.menuIcon}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                }

                <MenuPanel menuDisplayed={menuDisplayed} closeMenuCallback={() => {setMenuDisplayed(false)}} />
            </>
        )
    }

    return Result()
}

export default ScreenerNavbar



