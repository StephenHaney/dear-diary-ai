import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="theme-color" content="#000000" />
          <meta name="google" content="notranslate" />
          <link rel="icon" href="/favicon.png" />
          <link href="https://fonts.googleapis.com/css2?family=Lora:wght@432&display=swap" rel="stylesheet" />

          <style>{`
            body {
              margin: 0;
              overscroll-behavior: none;
              font-family: Lora;
              width: 100vw;
              height: 100vh;
            }
            `}</style>

          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-50429811-4"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag() {dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'UA-50429811-4');`,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
