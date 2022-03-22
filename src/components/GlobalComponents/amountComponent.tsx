import React from "react"
import { displayAmount } from "../../library/utils"
import { useAppSelector } from "../../app/hooks"

interface IAmountComponentProps {
    amount: string | null
}

const AmountComponent = (props: IAmountComponentProps): React.ReactElement => {
    const usdPrice = useAppSelector(state => state.usdPrice)

    if (props.amount) {
        return usdPrice.displayed ?
            <div>{displayAmount(true, props.amount, usdPrice.price)}</div>
            :
            <div>{displayAmount(false, props.amount)}</div>
    }

    return <div>-</div>
}

export default AmountComponent