import React from "react"
import Image from 'next/image'
import styles from "../styles/screenerSearchAndCreate.module.scss"
import Magnifier from "../public/images/magnifier.svg"
import CrossIcon from "../public/images/crossIcon.svg"
import { IRootContextType, RootContext } from "./screenerLayoutWrapper"
import { useMediaQuery } from 'react-responsive'

interface IScreenerSearchAndCreateProps {
    inputPlaceholder: string
    createButtonText: string
    idSearched: string
    setIdSearched: (idSearched: string) => void
}

export default function ScreenerSearchAndCreate(props: IScreenerSearchAndCreateProps): React.ReactElement {
    const rootContext: IRootContextType = React.useContext(RootContext)
    const isMobile = useMediaQuery({ maxWidth: 1200})

    const DesktopVersion = () => {
        let searchInput = React.createRef() as any

        React.useEffect(() => {
            searchInput.focus()
        })

        return (
            <div id={styles.searchAndCreate}>
                <div id={styles.searchContainer}>
                    <Magnifier id={styles.magnifier} />         
                    <input
                        onChange={ev => {props.setIdSearched(ev.target.value)}} 
                        type="text"
                        ref={input => {searchInput = input}}
                        id={styles.searchBar}
                        value={props.idSearched}
                        autoComplete='off'
                        placeholder={props.inputPlaceholder}
                    />      
                    {
                        props.idSearched != '' ?
                            <CrossIcon
                                id={styles.crossIcon}
                                onClick={() => {
                                    props.setIdSearched('')
                                    searchInput.value = ''
                                    searchInput.focus()
                                }}
                            /> 
                            : 
                            null
                    }
                </div>          
                <div onClick={rootContext.methods.setCreateWindowDisplayed} id={styles.createButton}>{props.createButtonText}</div>
            </div>
        )
    }

    const MobileVersion = () => {
        let searchInput = React.createRef() as any

        return (
            <div id={styles.searchAndCreateMobile}>
                <div 
                    id={styles.createButtonMobile}
                    onClick={rootContext.methods.setCreateWindowDisplayed}
                >
                    <Image src="/images/createWindowIcon.png" alt="Open create poll or oracle window" width={45} height={45} />
                </div>
                
                <div id={styles.searchContainer}>
                    <Magnifier id={styles.magnifier} />
                    <input
                        onChange={ev => {props.setIdSearched(ev.target.value)}} 
                        type="text"
                        ref={input => {searchInput = input}}
                        id={styles.searchBarMobile}
                        value={props.idSearched}
                        autoComplete='off'
                        placeholder="Search"
                    />

                    {
                        props.idSearched != '' ?
                            <CrossIcon
                                id={styles.crossIcon}
                                onClick={() => {
                                    props.setIdSearched('')
                                    searchInput.value = ''
                                    searchInput.focus()
                                }}
                            /> 
                            : 
                            null
                    }
                </div>
            </div>
        )
    }

    return (
        isMobile ?
            <MobileVersion />
        :
            <DesktopVersion />
    )
}
