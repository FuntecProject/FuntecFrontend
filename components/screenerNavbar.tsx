import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import GasIcon from "../public/images/gasIcon.svg"
import BellIcon from "../public/images/bellIcon.svg"
import CrossIcon from "../public/images/crossIcon.svg"
import ArbitrumIcon from "../public/images/arbitrum.svg"
import styles from "../styles/screenerNavbar.module.scss"
import { RootContext, IRootContextType } from './screenerLayoutWrapper'
import { getGasPrice } from '../library/web3methods'
import { useMediaQuery } from 'react-responsive'
import AccountButton from '../components/accountButton'

interface IScreenerNavbarState {
    balance: string
    gasPrice: string
}

export default function ScreenerNavbar(): React.ReactElement {
    const [state, setState] = React.useState<IScreenerNavbarState>({
        balance: "",
        gasPrice: 'N/A'
    })

    const rootContext: IRootContextType = React.useContext(RootContext)
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })

    React.useEffect(() => {
        const callback = async () => {
            if (rootContext.state.web3 != null) {
                let gasPrice = await getGasPrice(rootContext)

                setState(prevState => ({
                    ...prevState,
                    gasPrice: gasPrice
                }))
            }
        }

        callback()
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
            rootContext.state.menuDisplayed ?
                <CrossIcon style={{marginRight: '20px'}}/>
                :
                <div onClick={rootContext.methods.setMenuDisplayed} id={styles.menuIcon}>
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
                            <div id={styles.gasPrice}>{state.gasPrice}</div>
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
        isDesktopOrLaptop ?
            <DesktopNavbar />
            :
            <MobileNavBar />
    )
}


