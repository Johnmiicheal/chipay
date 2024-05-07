import { Flex, Text, Stack, useMediaQuery } from "@chakra-ui/react";
import Head from "next/head";
import { WebHeader } from "./Header";
import React, { useEffect } from "react";

interface LayoutProps {
  children?: React.ReactNode;
  title: string;
}
const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  useEffect( () => {
    async function fetchData() {
        const response = await fetch("https://api.greynote.app/chipay/user", {
          method: "GET",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
        })
        const data = await response.json()
        if (!data) {
          window.location.replace("/login");
        } 
    }
    fetchData()
  }, []);

  return (
    <Stack h="100vh">
      <Head>
        <title>{title} - Chipay</title>
        <link rel="shortcut icon" href="/icons/chilinear.svg" />
      </Head>
        <Flex direction="column" align="center" w="full" zIndex={1}>
          <Flex w="full" px={{ base: 1, lg: "10vw" }} bg="#670B78">
            <WebHeader />
          </Flex>

          <Flex w="full" pb={10} direction="column">{children}</Flex>
        </Flex>
    </Stack>
  );
};

export default Layout;
