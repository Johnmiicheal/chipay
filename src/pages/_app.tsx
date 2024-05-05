import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Head>
        <title>Chipay - Powered by Chimoney</title>
        <meta name="description" content="Fintech Dashboard by Chimoney" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icons/chilinear.svg" />
      </Head>
      <Component {...pageProps} />;
    </ChakraProvider>
  );
}
