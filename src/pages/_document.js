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

          <meta property="og:title" content="Dear Diary AI" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://deardiary.ai/complete-tree.png" />
          <meta
            property="og:description"
            content="Find awareness and peace through the act of writing a journal entry. Our AI will write a song for you based on your writing."
          />
          <meta property="og:determiner" content="the" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:site_name" content="DearDiary.ai" />

          <meta name="twitter:title" content="Dear Diary AI" />
          <meta
            name="twitter:description"
            content="Find awareness and peace through the act of writing a journal entry. Our AI will write a song for you based
            on your writing."
          />
          <meta name="twitter:image" content=" https://deardiary.ai/complete-tree.png" />
          <meta name="twitter:card" content="summary_large_image" />

          <link rel="icon" href="/favicon.png" />
          <link href="https://fonts.googleapis.com/css2?family=Lora:wght@432&display=swap" rel="stylesheet" />

          <style>{`
            html, body {
              height: '100%',
              maxHeight: '100%',
            }

            body {
              margin: 0;
              overscroll-behavior: none;
              font-family: Lora;
              width: 100vw;
              overflow: 'hidden',
            }

            a {
              color: #464da4;
              text-decoration: none;
            }

            a:hover {
              text-decoration: underline;
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
