import UserApiProvider from "@/components/ChiProvider";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { HydrationOverlay } from "@builder.io/react-hydration-overlay";


export default function App({ Component, pageProps }: AppProps) {
  if (typeof window === "undefined") {
    return <></>;
  }
  return (
    <ChakraProvider>
      <UserApiProvider>
        <Head>
          <title>Chipay - Powered by Chimoney</title>
          <meta name="description" content="Fintech Dashboard by Chimoney" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/icons/chilinear.svg" />
        </Head>
        <HydrationOverlay>
        <Component {...pageProps} />
        </HydrationOverlay>
      </UserApiProvider>
    </ChakraProvider>
  );
}
