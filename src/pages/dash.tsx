import Layout from "@/components/Layout";
import { Text, Flex, Image, Button, Box, Badge } from "@chakra-ui/react";
import { useUserAPI } from "@/components/ChiProvider";
import { format } from "date-fns";
import { IoSendOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { AccountCard } from "@/components/AccountCard";
import React from "react";
import { Actions } from "@/components/Actions";
import { Transactions } from "@/components/Transactions";

const Dashboard = () => {
  const { profileData } = useUserAPI();

  return (
    <Layout title="Dashboard">
      <Flex
        align="center"
        justify="space-between"
        bg="#670B78"
        color="white"
        px={{ base: 4, lg: "10vw" }}
        pt={{ base: "50px", lg: "10vw" }}
        pb={{ base: "90px", lg: "130px" }}
      >
        <Text fontSize="18" fontWeight={600}>
          Welcome Back, {profileData.userBio.fullName} 👋
        </Text>
        <Text>{format(new Date(), "eeee, do MMMM yyyy")}</Text>
      </Flex>
      <Flex
        w="full"
        direction={{ base: "column", xl: "row" }}
        px={{ base: 4, lg: "10vw" }}
        align="center"
        justify="center"
        gap={5}
        mt={-14}
      >
        <Flex direction="column" gap={5}>
          <AccountCard
            type={profileData.userWallet[1]?.type}
            amount={profileData.userWallet[1]?.balance}
            isActive={true}
          />
          <Actions />
        </Flex>
        <Flex direction="column" gap={5} h="full" align="start" w="full">
          <Flex gap={5} align="center" direction={{ base: "column", xl: "row" }} w="full">
            <AccountCard
              type={profileData.userWallet[0]?.type}
              amount={profileData.userWallet[0]?.balance}
              isActive={false}
            />
            <AccountCard
              type={profileData.userWallet[2]?.type}
              amount={profileData.userWallet[2]?.balance}
              isActive={false}
            />
          </Flex>
          <Transactions trxn={profileData.userTransactions} />
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Dashboard;
