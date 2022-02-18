import React from "react"
import Image from "next/dist/client/image"

interface ILoadingElementProps {
    className: string
}

export default function LoadingElement(props: ILoadingElementProps): React.ReactElement {
    return (
        <div className={props.className}>
            <Image 
                src="/images/loadingHeart.gif" 
                alt="Loading oracles" 
                width={20} 
                height={20}
            />
        </div>
    )
}