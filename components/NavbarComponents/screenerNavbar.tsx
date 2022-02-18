import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import GasIcon from "./../../public/images/gasIcon.svg"
import BellIcon from "./../../public/images/bellIcon.svg"
import CrossIcon from "./../../public/images/crossIcon.svg"
import styles from "./../../styles/screenerNavbar.module.scss"
import { RootContext, IRootContextType } from '../Global components/screenerLayoutWrapper'
import { getGasPrice } from '../../library/web3methods'
import { useMediaQuery } from 'react-responsive'
import AccountButton from './accountButton'
import MenuPanel from './menuPanel'


const ScreenerNavbar = (): React.ReactElement => {
    const [gasPrice, setGasPrice] = React.useState<string>('N/A')
    const [menuDisplayed, setMenuDisplayed] = React.useState<boolean>(false)

    const rootContext: IRootContextType = React.useContext(RootContext)
    const isMobile = useMediaQuery({ maxWidth: 1200})

    React.useEffect(() => {
        if (rootContext.state.web3 != null) {
            getGasPrice(rootContext)
                .then(gasPrice => {
                    setGasPrice(gasPrice)
                })
        }
    }, [rootContext.state])

    const NavElement = (props: {page: string, textContent: string}) => {
        return (
            <Link href={`/${props.page}`}>
                <a className={styles.navElement} >
                    {props.textContent}   
                    
                    {
                        rootContext.state.activePage == props.page ?
                            <div className={`${styles.navElementSurline} ${styles.active}`}></div> :
                            <div className={styles.navElementSurline}></div>
                    }
                </a>
            </Link>
        )
    }

    const MenuButtonElement = (): React.ReactElement => {
        return (
            menuDisplayed ?
                <CrossIcon style={{marginRight: '20px'}}/>
                :
                <div onClick={() => {setMenuDisplayed(true)}} id={styles.menuIcon}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
        )
    }

    const DesktopNavbar = (): React.ReactElement => {
        return (
            <div id={styles.nav}>
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
                        {/* <div id={styles.arbitrumNavElement}>
                            <ArbitrumIcon id={styles.arbitrumIcon} onClick={rootContext.methods.setArbitrumNetworkWindowDisplayed} />
                        </div> */}

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

    const MobileNavBar = (): React.ReactElement => {
        return (
            <div id={styles.navMobile}>
                <Link href="/">
                    <a id={styles.home}>
                        <Image src="/images/appIcon.svg" alt="App icon" width={30} height={30} />
                    </a>
                </Link>

                <MenuButtonElement />
            </div>
        )
    }

    return (
        <>
            {
                isMobile ?
                    <MobileNavBar />
                    :
                    <DesktopNavbar />
            }

            <MenuPanel menuDisplayed={menuDisplayed} closeMenuCallback={() => {setMenuDisplayed(false)}} />
        </>
    )
}

export default ScreenerNavbar


