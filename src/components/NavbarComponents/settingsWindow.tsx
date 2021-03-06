import React from 'react'
import Switch from 'react-switch'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { changeDisplayed } from '../../features/usdPriceSlide'
import ScreenMouseLock from '../GlobalComponents/screenMouseLock'

interface ISettingsWindowProps {
    displayed: boolean
    closeSettingsCallback: () => void
}

interface ISettingsElementProps {
    text: String
    checked: boolean
    onChange: () => void
}

const SettingsWindow = (props: ISettingsWindowProps): React.ReactElement => {
    const usdPrice = useAppSelector(state => state.usdPrice)
    const dispatch = useAppDispatch()

    const Result = () => {
        return props.displayed ?
            <>
                <div style={{...WindowStyle, ...{top: '58px'}}}>
                    <SettingsElements />
                </div>

                <ScreenMouseLock backgroundShadowed={false} removeDisplayedElement={props.closeSettingsCallback} />
            </>
            :
            <div style={WindowStyle}>
                <SettingsElements />
            </div>
    }

    const SettingsElements = () => {
        return (
            <>
                <SettingsElement text="Show amounts in USD" checked={false} onChange={() => {dispatch(changeDisplayed())}} />
            </>
        )
    }
    
    const SettingsElement = (_props: ISettingsElementProps) => {
        return (
            <div style={SettingsElementStyle}>
                <div style={TextStyle}>{_props.text}</div>
                <Switch checked={usdPrice.displayed} onChange={_props.onChange}/>
            </div>
        )
    }

    return Result()
}

//top: '35px'

const WindowStyle = {
    position: 'absolute',
    top: '-220px',
    right: -20,
    zIndex: '10',
    transition: '0.3s',
    minWidth: '300px',
    minHeight: '200px',
    backgroundColor: 'white',
    border: '1px solid #d3d3d4',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px'
} as React.CSSProperties

const SettingsElementStyle = {
    display: 'flex',
    justifyContent: 'space-between'
} as React.CSSProperties

const TextStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 0,
    marginRight: '30px'
}

export default SettingsWindow