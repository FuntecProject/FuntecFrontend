import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name="keywords" content='Web3, ethereum, content creators, youtube, podcast, monetization, contribute' />
                    <meta name="description" content="Here we help you get the videos, 
                        streams, books that you want 
                        by allowing you to incentivise 
                        creators to produce specific content."
                    />
                    <meta name='theme-color' content='#E5E5E5' />

                    <link rel="icon" type="image/x-icon" href="/images/appIcon.svg"></link>
                    <link rel="apple-touch-icon" href="/images/appIcon.png"></link>
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

