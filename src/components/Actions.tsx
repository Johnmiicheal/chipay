import Layout from "@/components/Layout";
import { Text, Flex, Button, Box, SimpleGrid, Icon, useDisclosure } from "@chakra-ui/react";
import React from "react";
import {
  IoBulbOutline,
  IoCartOutline,
  IoGiftOutline,
  IoPhonePortraitOutline,
  IoReloadOutline,
  IoSendOutline,
  IoWifiOutline,
} from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { PiHandCoins, PiPiggyBank, PiTelevision } from "react-icons/pi";
import { GetAirtime } from "./GetAirtime";

export const Actions = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  const actions = [
    {
      icon: IoPhonePortraitOutline,
      label: "Airtime",
      color: "#BF9A14",
      click: () => onOpen()
    },
    {
      icon: IoCartOutline,
      label: "Shop",
      color: "#5E00AB",
    },
    {
      icon: IoBulbOutline,
      label: "Electricity",
      color: "#EE4141",
    },
    {
      icon: IoGiftOutline,
      label: "Gift",
      color: "#DB00D4",
    },
    {
      icon: IoWifiOutline,
      label: "Data",
      color: "#078FCA",
    },
    {
      icon: PiHandCoins,
      label: "Loan",
      color: "#783636",
    },
    {
      icon: IoReloadOutline,
      label: "Subscription",
      color: "#40981F",
    },
    {
      icon: PiTelevision,
      label: "Cable",
      color: "#0F1571",
    },
    {
      icon: PiPiggyBank,
      label: "Saving",
      color: "#4C199A",
    },
  ];
  return (
    <Box
      borderRadius={"md"}
      bg="white"
      border="1px solid #e2e2e2"
      boxShadow={"md"}
      p={3}
      w={{ base: "full", md: "350px"}}
    >
      <Text fontSize={12} fontWeight={500}>
        Quick Actions
      </Text>
      <SimpleGrid mt={2} spacing={3} columns={3}>
        {actions.map((item, index: number) => (
            <Flex rounded="md" p={5} height="85px" cursor="pointer" onClick={item.click} _hover={{ bg: "#f2f2f2"}} direction="column" gap={2} justify={"center"} align="center"  key={index} border="1px solid #e2e2e2">
                <Icon as={item.icon} color={item.color} />
                <Text fontSize={13}>{item.label}</Text>
            </Flex>
        ))}
      </SimpleGrid>
      <GetAirtime isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};
