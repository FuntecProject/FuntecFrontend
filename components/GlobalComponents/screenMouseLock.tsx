import React from "react"
import { IRootContextType, RootContext } from "./screenerLayoutWrapper"

interface IScreenMouseLockProps {
    backgroundShadowed: boolean
    removeDisplayedElement: () => void
}

const ScreenMouseLock = (props: IScreenMouseLockProps): React.ReactElement | null => {
    const rootContext = React.useContext<IRootContextType>(RootContext)

    if (props.backgroundShadowed) {
        return (
            <div 
                onClick={() => {props.removeDisplayedElement()}} 
                style={Object.assign({}, screenMouseLockStyle, {backdropFilter: "blur(10px)"})} 
            />
        )
    }

    return (
        <div 
            onClick={() => {props.removeDisplayedElement()}}
            style={screenMouseLockStyle}
        />
    )
}

const screenMouseLockStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    zIndex: "5"
} as React.CSSProperties

export default ScreenMouseLock

