import React from "react"

interface IScreenMouseLockProps {
    backgroundShadowed: boolean
    removeDisplayedElement: () => void
}

const ScreenMouseLock = (props: IScreenMouseLockProps): React.ReactElement => {
    return props.backgroundShadowed ?
        <div 
            onClick={props.removeDisplayedElement} 
            style={Object.assign({}, screenMouseLockStyle, {backdropFilter: "blur(10px)"})} 
        />
        :
        <div 
            onClick={props.removeDisplayedElement}
            style={screenMouseLockStyle}
        />
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

