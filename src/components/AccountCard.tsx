import Layout from "@/components/Layout";
import {
  Text,
  Flex,
  Button,
  Box,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import {
  IoSendOutline,
} from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { SendMoney } from "./SendMoney";
import { Deposit } from "./AddMoney";

interface AccountProps {
  amount: number;
  type: string;
  isActive: boolean;
}

export const AccountCard: React.FC<AccountProps> = ({
  amount,
  type,
  isActive,
}) => {
  const {
    onOpen: onDepOpen,
    isOpen: isDepOpen,
    onClose: onDepClose,
  } = useDisclosure();
  const {
    onOpen: onSendOpen,
    isOpen: isSendOpen,
    onClose: onSendClose,
  } = useDisclosure();
  const {
    onOpen: onBankOpen,
    isOpen: isBankOpen,
    onClose: onBankClose,
  } = useDisclosure();


  return (
    <Box
      borderRadius={"md"}
      bg="white"
      border="1px solid #e2e2e2"
      boxShadow={"md"}
      p={3}
      w={{ base: "full", md: "350px" }}
      h={isActive === true ? "180px" : "120px"}
    >
      <Flex align="center" justify="space-between" w="full">
        <Text fontSize={12} fontWeight={500}>
          Account Balance
        </Text>
        <Badge rounded="full" colorScheme="purple" fontSize="10" py={1} px={2}>
          {type} Wallet
        </Badge>
      </Flex>
      <Text mt={3} fontSize={36} fontWeight={"extrabold"}>
        <Text display="inline" fontWeight={400} fontSize={18}>
          USD.
        </Text>
        {amount?.toLocaleString()}
      </Text>
      <Flex
        align="center"
        gap={3}
        mt={6}
        display={isActive === true ? "flex" : "none"}
      >

            <Button
              fontSize={12}
              py={3}
              border="1px solid #580867"
              bg="#670B78"
              w="fit-content"
              color="white"
              _hover={{ bg: "#580867" }}
              rounded="md"
              leftIcon={<IoSendOutline />}
              onClick={onSendOpen}
            >
              Send Money
            </Button>
          
        <Button
          fontSize={12}
          py={3}
          border="1px solid #580867"
          bg="#670B78"
          w="fit-content"
          color="white"
          _hover={{ bg: "#580867" }}
          rounded="md"
          leftIcon={<LuDownload />}
          onClick={onDepOpen}
        >
          Deposit Money
        </Button>
      </Flex>
      <SendMoney isOpen={isSendOpen} onClose={onSendClose} />
      <Deposit isOpen={isDepOpen} onClose={onDepClose} />
    </Box>
  );
};
