import React from "react";

interface IScreenerBoxProps {
    children: React.ReactElement
} 

const ScreenerBox = (props: IScreenerBoxProps): React.ReactElement => {
    return (
        <div style={style}>
            {props.children}
        </div>
    )
}

const style = {
    border: '1px solid #e5e7eb',
    backgroundColor: 'white',
    marginBottom: '30px',
    borderRadius: '15px',
    flexGrow: '1',
    width: '90%'
}

export default ScreenerBox

