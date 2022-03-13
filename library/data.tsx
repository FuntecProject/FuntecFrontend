import metaData from "../public/etc/metaData.json"

class USDPrice {
    private static price: Number

    public static getPrice = async() => {
        if (USDPrice.price) {
            return USDPrice.price
        }   

        return await this.setPrice()
    }

    private static setPrice = async() => {
        let response = await fetch(metaData.usdPriceUrl)
        USDPrice.price = (await response.json()).ethereum.usd

        return USDPrice.price
    }
}

export {
    USDPrice
} 